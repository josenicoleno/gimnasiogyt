import { useEffect, useState } from "react";  

export default function About() {
  const [about, setAbout] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch(`/api/param/about`);
      if (res.ok) {
        const data = await res.json();
        setAbout(data.text);
      }
    };
    const fetchAboutTitle = async () => {
      const res = await fetch(`/api/param/aboutTitle`);
      if (res.ok) {
        const data = await res.json();
        setAboutTitle(data.text);
      }
    };
    fetchAbout();
    fetchAboutTitle();
  }, []);
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold mx-auto p-3 text-center'>{aboutTitle}</h1>
          <div dangerouslySetInnerHTML={{ __html: about }} />
        </div>
      </div>
    </div>
  )
}