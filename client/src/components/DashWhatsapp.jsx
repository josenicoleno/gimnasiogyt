import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

export default function DashWhatsapp() {
  const keyPhoneNumber = 'wppPhoneNumber'
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappNumberId, setWhatsappNumberId] = useState("");
  const [whatsappNumberIsNew, setWhatsappNumberIsNew] = useState(false);
  
  const keyTextMessage = 'wppTextMessage'
  const [textMessage, setTextMessage] = useState("");
  const [textMessageId, setTextMessageId] = useState("");
  const [textMessageIsNew, setTextMessageIsNew] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWppPhoneNumber = async () => {
      const res = await fetch(`/api/param/${keyPhoneNumber}`);
      if (res.ok) {
        const data = await res.json();
        setWhatsappNumberId(data._id);
        setWhatsappNumber(data.text);
      } else {
        setWhatsappNumberIsNew(true);
      }
    }
    const fetchWppTextMessage = async () => {
      const res = await fetch(`/api/param/${keyTextMessage}`);
      if (res.ok) {
        const data = await res.json();
        setTextMessageId(data._id);
        setTextMessage(data.text);
      } else {
        setTextMessageIsNew(true);
      }
    }
    fetchWppPhoneNumber();
    fetchWppTextMessage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (whatsappNumberIsNew) {
      const res = await fetch(`/api/param/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: keyPhoneNumber, text: whatsappNumber }),
      });
      if (res.ok) {
        setSuccess("Phone number created successfully");
      } else {
        setError("Failed to create phone number");
      }
    } else {
      const res = await fetch(`/api/param/${whatsappNumberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: whatsappNumber }),
      });
      if (res.ok) {
        setSuccess("Phone number updated successfully");
      } else {
        setError("Failed to update phone number");
      }
    }
    if (textMessageIsNew) {
      const res = await fetch(`/api/param/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: keyTextMessage, text: textMessage }),
      });
      if (res.ok) {
        setSuccess("Message created successfully");
      } else {
        setError("Failed to create message");
      }
    } else {
      const res = await fetch(`/api/param/${textMessageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textMessage }),
      });
      if (res.ok) {
        setSuccess("Message updated successfully");
      } else {
        setError("Failed to update message");
      }
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 items-center mt-10">
      <h1 className="text-2xl font-bold">Whatsapp</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl w-full flex flex-col gap-4">
        <TextInput
          id="whatsappNumber"
          type="text"
          placeholder="Number"
          value={whatsappNumber}
          onChange={e => setWhatsappNumber(e.target.value)}
        />
        <TextInput
          id="textMessage"
          placeholder="Message"
          className=""
          required
          value={textMessage}
          onChange={e => setTextMessage(e.target.value)}
        />
        <Button gradientDuoTone="purpleToPink" outline type="submit">
          Save
        </Button>
      </form>
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
    </div>
  );
}
