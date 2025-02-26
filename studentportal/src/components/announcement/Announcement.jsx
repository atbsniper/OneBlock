import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./announcement.css";

const Announcement = () => {
  const { courseID } = useParams();
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "announcements"));
        const announcementsData = querySnapshot.docs.map((doc) => doc.data());
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    try {
      const newAnnouncement = {
        message: announcement,
        type: "announcement",
        timestamp: new Date().toLocaleString(),
        teacherName: "Teacher Name", // Replace with actual teacher name
        courseID: courseID,
      };
      await addDoc(collection(db, "announcements"), newAnnouncement);
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncement("");
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  return (
    <div className="announcement-container">
      <div className="announcement-box">
        <h2>Add Announcement for {courseID}</h2>
        <form onSubmit={handleAddAnnouncement}>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Enter announcement..."
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>
      <div className="announcements-list">
        <h2>Recent Announcements</h2>
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Teacher</th>
              <th>Course</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement, index) => (
              <tr key={index}>
                <td>{announcement.message}</td>
                <td>{announcement.teacherName}</td>
                <td>{announcement.courseID}</td>
                <td>{announcement.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Announcement;