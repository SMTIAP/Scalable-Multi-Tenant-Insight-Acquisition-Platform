import { useState } from "react";
import axios from "axios";
import './SendReceiveEmails.css';
import { useNavigate } from 'react-router-dom';


export default function SendEmail() {
const navigate = useNavigate();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {

    if (!to || !subject || !message) {
        alert("Please fill all fields");
        return;
    }

    

    try {
        setLoading(true);
        const res = await axios.post("http://localhost:5000/send-email", {
        to,
        subject,
        text: message,
      });

      if (res.data.success) {
        alert("Email Sent Successfully!");

        //Clear form fields
        setTo("");
        setSubject("");
        setMessage("");

      } else {
        alert("Email Failed: " + res.data.error);
      }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            alert("Error sending email: " + error.response?.data?.error || error.message);
        } else if (error instanceof Error) {
            alert("Error sending email: " + error.message);
        } else {
            alert("Unknown error occurred");
        }
    } finally {
      setLoading(false);
    }

  };

  return (

    
    <div className="email-container">

        <header className="email-header">
            <button
            className="back-button"
            onClick={() => navigate('/poc-hub')}
            >
                ← Back to POC Hub
            </button>
            <h2>Send Email Notification</h2>
        </header>

      

      <input
        type="email"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "100%", margin: "10px 0", padding: "10px" }}
      />

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: "100%", margin: "10px 0", padding: "10px" }}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: "120px", padding: "10px" }}
      />

      <button onClick={sendEmail} className="send-btn" disabled={loading}>
        {loading ? "Sending..." : "Send Email"}
     </button>

    </div>
  );
}
