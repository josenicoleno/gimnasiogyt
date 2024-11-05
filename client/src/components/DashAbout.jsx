import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
export default function DashAbout() {
  const [about, setAbout] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutIsNew, setAboutIsNew] = useState(false);
  const [aboutTitleIsNew, setAboutTitleIsNew] = useState(false);
  const [aboutId, setAboutId] = useState("");
  const [aboutTitleId, setAboutTitleId] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aboutIsNew) {
      const res = await fetch(`/api/param/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "about", text: about }),
      });
      if (res.ok) {
        setSuccess("About created successfully");
      } else {
        setError("Failed to create about");
      }
    } else {
      const res = await fetch(`/api/param/${aboutId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: about }),
      });
      if (res.ok) {
        setSuccess("About updated successfully");
      } else {
        setError("Failed to update about");
      }
    }
    if (aboutTitleIsNew) {
      const res = await fetch(`/api/param/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "aboutTitle", text: aboutTitle }),
      });
      if (res.ok) {
        setSuccess("About title created successfully");
      } else {
        setError("Failed to create about title");
      }
    } else {
      const res = await fetch(`/api/param/${aboutTitleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: aboutTitle }),
      });
      if (res.ok) {
        setSuccess("About title updated successfully");
      } else {
        setError("Failed to update about title");
      }
    }
    setTimeout(() => {
      navigate("/about");
    }, 1000);
  }

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch(`/api/param/about`);
      if (res.ok) {
        const data = await res.json();
        setAboutId(data._id);
        setAbout(data.text);
      } else {
        setAboutIsNew(true);
      }
    }
    const fetchAboutTitle = async () => {
      const res = await fetch(`/api/param/aboutTitle`);
      if (res.ok) {
        const data = await res.json();
        setAboutTitleId(data._id);
        setAboutTitle(data.text);
      } else {
        setAboutTitleIsNew(true);
        setAboutTitle("");
      }
    }
    fetchAbout();
    fetchAboutTitle();
  }, []);

  return (
    <div className="flex flex-col w-full gap-4 items-center justify-center">
      <h1 className="text-2xl font-bold">About</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl w-full flex flex-col gap-4">
        <TextInput
          id="aboutTitle"
          type="text"
          placeholder="About Title"
          value={aboutTitle}
          onChange={e => setAboutTitle(e.target.value)}
        />
        <ReactQuill
          id="content"
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          value={about}
          onChange={value => setAbout(value)}
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
