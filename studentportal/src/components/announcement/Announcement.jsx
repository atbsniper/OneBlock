import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Banner from "../banner/Banner";
import "./Announcement.css";

const Announcement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState(null);
  const [isIndexing, setIsIndexing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Logged in user:", user);
    
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/");
      return;
    }

    setLoggedInUser(user);
    
    // Find the course name from the user's courses
    if (user.courses) {
      const course = user.courses.find(c => c.courseID === id);
      console.log("Found course:", course);
      if (course) {
        setCourseName(course.courseName);
      } else {
        console.log("Course not found in user's courses");
        setError("Course not found in your assigned courses");
      }
    } else {
      console.log("No courses found for user");
      setError("No courses found for your account");
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!id) {
        console.log("No course ID available");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching announcements for course:", id);
        const announcementsRef = collection(db, "announcements");
        // Query announcements for this course only
        const q = query(
          announcementsRef,
          where("courseID", "==", id),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size);
        const announcementsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched announcements:", announcementsData);
        setAnnouncements(announcementsData);
        setIsIndexing(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        // Check if the error is related to indexing
        if (error.message && error.message.includes("index")) {
          setIsIndexing(true);
          setError("Creating index for better performance. Please wait a moment and try again...");
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchAnnouncements();
    }
  }, [id, loggedInUser]);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim() || !loggedInUser) {
      console.log("Cannot add announcement:", { 
        hasAnnouncement: !!announcement.trim(), 
        hasUser: !!loggedInUser 
      });
      return;
    }

    try {
      const timestamp = new Date();
      const newAnnouncement = {
        message: announcement,
        type: "announcement",
        timestamp: timestamp,
        timestampString: timestamp.toLocaleString(),
        teacherName: loggedInUser.name,
        courseID: id,
        courseName: courseName
      };

      console.log("Adding new announcement:", newAnnouncement);
      const docRef = await addDoc(collection(db, "announcements"), newAnnouncement);
      console.log("Added announcement with ID:", docRef.id);
      setAnnouncements([{ id: docRef.id, ...newAnnouncement }, ...announcements]);
      setAnnouncement("");
    } catch (error) {
      console.error("Error adding announcement:", error);
      setError(error.message);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setIsIndexing(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderAnnouncementForm = () => {
    if (!loggedInUser || !id) return null;

    return (
      <div className="announcement-box">
        <h2>Add Announcement for {courseName || id}</h2>
        <form onSubmit={handleAddAnnouncement}>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Enter announcement..."
            required
          />
          <button type="submit">Post Announcement</button>
        </form>
      </div>
    );
  };

  if (!loggedInUser) {
    return (
      <div>
        <Banner />
        <div className="announcement-container">
          <div className="error-message">Please log in to view announcements</div>
          <div className="logout-container">
            <button onClick={handleBack}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Banner />
        <div className="announcement-container">
          <div className="error-message">
            {error}
            {isIndexing && (
              <button onClick={handleRetry}>Retry</button>
            )}
          </div>
          {renderAnnouncementForm()}
          <div className="logout-container">
            <button onClick={handleBack}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Banner />
        <div className="announcement-container">
          <div className="loading">Loading announcements for {courseName || id}...</div>
          <div className="logout-container">
            <button onClick={handleBack}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner />
      <div className="announcement-container">
        {renderAnnouncementForm()}
        <div className="announcements-list">
          <h2>Recent Announcements for {courseName || id}</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet for this course.</p>
          ) : (
            <div className="announcement-cards">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card">
                  <div className="course-name">{announcement.courseName || announcement.courseID}</div>
                  <div className="teacher-name">Posted by: {announcement.teacherName}</div>
                  <div className="message">{announcement.message}</div>
                  <div className="timestamp">{announcement.timestampString}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="logout-container">
          <button onClick={handleBack}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Announcement;