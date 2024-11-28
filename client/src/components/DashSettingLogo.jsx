import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';

export default function DashSettingLogo() {
  const keyLogo = 'Logo'
  const [formDataLogo, setFormDataLogo] = useState({
    key: keyLogo,
    text: ""
  });
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);

  const keyMarca = 'Marca'
  const [formDataMarca, setFormDataMarca] = useState({
    key: keyMarca,
    text: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      const res = await fetch(`/api/param/${keyLogo}`);
      if (res.ok) {
        const data = await res.json();
        setFormDataLogo({
          _id: data._id,
          key: keyLogo,
          text: data.text
        });
      }
    }
    const fetchMarca = async () => {
      const res = await fetch(`/api/param/${keyMarca}`);
      if (res.ok) {
        const data = await res.json();
        setFormDataMarca({
          _id: data._id,
          key: keyMarca,
          text: data.text
        });
      }
    }
    fetchLogo();
    fetchMarca();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formDataLogo._id, formDataMarca._id)
    if (!formDataLogo._id) {
      const res = await fetch(`/api/param/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataLogo),
      });
      if (res.ok) {
        setSuccess("Phone number created successfully");
      } else {
        setError("Failed to create phone number");
      }
    } else {
      const res = await fetch(`/api/param/${formDataMarca._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: formDataLogo.text }),
      });
      if (res.ok) {
        setSuccess("Phone number updated successfully");
      } else {
        setError("Failed to update phone number");
      }
    }
    if (!formDataMarca._id) {
      const res = await fetch(`/api/param/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataMarca),
      });
      if (res.ok) {
        setSuccess("Message created successfully");
      } else {
        setError("Failed to create message");
      }
    } else {
      const res = await fetch(`/api/param/${formDataMarca._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: formDataMarca.text }),
      });
      if (res.ok) {
        setSuccess("Message updated successfully");
      } else {
        setError("Failed to update message");
      }
    }
  }

  const handledUploadImage = () => {
    try {
      if (!file) {
        return setImageUploadError('Please select an image')
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0))
        },
        error => {
          setImageUploadError('Image upload error');
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormDataLogo({ ...formDataLogo, text: downloadURL })
          })
        }
      )
    } catch (error) {
      setImageUploadError('Image upload error');
      setImageUploadProgress(null);
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 items-center">
      <h1 className="text-2xl font-bold">Logo y Marca</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl w-full flex flex-col gap-4">
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type='file'
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handledUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress
              ? <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
              : 'Upload image'}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color="failure" className="mt-4" >
            {imageUploadError}
          </Alert>
        )}
        {formDataLogo.image && (
          <img src={formDataLogo.text} alt="upload" className="w-full h-72 object-cover" />
        )}
        <TextInput
          id="marca"
          type="text"
          placeholder="Marca"
          value={formDataMarca.text}
          onChange={e => setFormDataMarca({ ...formDataMarca, text: e.target.value })}
        />
        {console.log(formDataMarca)}
        {console.log(formDataLogo)}
        <Button gradientDuoTone="purpleToPink" outline type="submit">
          Save
        </Button>
      </form>
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
    </div>
  );
}
