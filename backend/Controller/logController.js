const logGard = require("../Model/logModel");
const { Web3 } = require("web3");
const {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  getDocs,
  runTransaction,
} = require("firebase/firestore");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyCMyxy0sY96aKQSwpa-3tGH_NtxAF4oK5Q",
  authDomain: "logviewer-966bc.firebaseapp.com",
  projectId: "logviewer-966bc",
  storageBucket: "logviewer-966bc.appspot.com",
  messagingSenderId: "179279904966",
  appId: "1:179279904966:web:80ee1fe727d208264157c7",
  measurementId: "G-122MQKK30H",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const getStudents = async () => {
  let students = [];
  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    students.push(doc.data());
  });
  return students;
};

// Fetches all logs from the smart contract
exports.getLog = async (req, res, next) => {
  var data = await logGard.methods.getLogs().call();
  const transformedData = data.map((obj) => ({
    tokenId: Number(obj.tokenId),
    uri: obj.uri, 
  }));

  console.log(transformedData);

  res.status(200).json({
    status: "success",
    logs: transformedData,
  });
};
// uploads new logs to the smart contract 
exports.uploadLogs = async (req, res, next) => {
  const { action, teacherName, type, data, prevData } = req.body;

  console.log("action: " + action, "teacherName: " + teacherName);
  console.log("data", data);
  console.log("prevData", prevData);
  const privateKey = process.env.VITE_SIGNER_PRIVATE_KEY;
  const PublicKey = process.env.VITE_ADMIN_ADDRESS;
  const logGardContractAddress = process.env.CNTRACTADDRESS;

 
  const currentTime = new Date();
  const date = currentTime.toISOString().slice(0, 10);
  const hours = ("0" + currentTime.getHours()).slice(-2);
  const minutes = ("0" + currentTime.getMinutes()).slice(-2);
  const formattedTime = `${date} ${hours}:${minutes}`;

  console.log(formattedTime);

  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  // Function to detect browser
  function detectBrowser(userAgent) {
    if (/edg/i.test(userAgent)) {
      return "Microsoft Edge";
    } else if (/chrome/i.test(userAgent)) {
      return "Google Chrome";
    } else if (/safari/i.test(userAgent)) {
      return "Safari";
    } else if (/firefox/i.test(userAgent)) {
      return "Mozilla Firefox";
    } else if (/opera|opr/i.test(userAgent)) {
      return "Opera";
    } else if (/msie|trident/i.test(userAgent)) {
      return "Internet Explorer";
    } else {
      return "Unknown Browser";
    }
  }

  // Detect browser from user agent
  const browser = detectBrowser(userAgent);

  console.log("Detected Browser:", browser);

  const logs = {
    ipAddress: ipAddress,
    timestamp: formattedTime,
    detectedBrowser: browser,
    teacherName: teacherName,
    action: action,
    type: type,
    data: JSON.stringify(data),
    prevData: JSON.stringify(prevData),
  };

  const tx = {
    from: PublicKey,
    to: logGardContractAddress,
    data: logGard.methods
      .uploadLog(PublicKey, JSON.stringify(logs))
      .encodeABI(),
  };
  // console.log(tx);

  const web3 = new Web3(process.env.PROVIDER);

  // Get the current nonce for the transaction
  const nonce = await web3.eth.getTransactionCount(PublicKey);
  tx.nonce = nonce;
  try {
    // Estimate gas for the transaction
    const gas = await web3.eth.estimateGas(tx);
    tx.gas = gas;

    // Get the current gas price on the network
    const gasPrice = await web3.eth.getGasPrice();
    tx.gasPrice = gasPrice;

    // Sign the transaction with the sender's private key
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send the signed transaction to the Ethereum network
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    // Increment counter and save transaction hash
    const counterRef = doc(db, "counters", "counterDoc");

    try {
      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let newCount;

        if (!counterDoc.exists()) {
          // Initialize counter to 0 if it does not exist
          newCount = 0;
          transaction.set(counterRef, { count: newCount });
        } else {
          newCount = counterDoc.data().count + 1;
          transaction.update(counterRef, { count: newCount });
        }

        // Save transaction hash with the new counter value
        const hashRef = doc(db, "transactionHashes", newCount.toString());
        transaction.set(hashRef, {
          transactionHash: receipt.transactionHash,
          type: type,
          action: action,
        });
      });

      console.log(
        "Counter incremented and transaction hash saved successfully"
      );
    } catch (e) {
      console.error(
        "Error incrementing counter and saving transaction hash: ",
        e
      );
    }

    res.status(200).json({
      status: "success",
      hash: receipt.transactionHash,
      // tokenId: tokenId,
      logs: logs,
    });

    console.log("Transaction hash number:", receipt.transactionHash);
  } catch (error) {
    console.log("Error sending transaction:", error.message);
  }
};
