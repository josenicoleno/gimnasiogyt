import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { socialNetworks } from "../../public/data";

export default function DashSettingSocialNetworks() {
  const createSocialNetworkState = (key) => ({
    socialNetwork: key,
    key,
    text: "",
    boolean: false,
  });
  const [socialNetworkStates, setSocialNetworkStates] = useState(socialNetworks?.map(sn => { return createSocialNetworkState(sn) }));

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarca = async () => {
      const updatedStates = await Promise.all(socialNetworkStates.map(async sn => {
        try {
          const res = await fetch(`/api/param/${sn.key}`);
          if (res.ok) {
            const data = await res.json();
            return { ...sn, _id: data._id, text: data.text, boolean: data.boolean };
          }
        } catch (error) {
          // Manejo de errores
        }
        return sn;
      }));
      setSocialNetworkStates(updatedStates);
    }
    fetchMarca();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    socialNetworkStates.map(async sn => {
      if (!sn._id) {
        const res = await fetch(`/api/param/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sn),
        });
        if (res.ok) {
          setSuccess("Phone number created successfully");
        } else {
          setError("Failed to create phone number");
        }
      } else {
        const res = await fetch(`/api/param/${sn._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: sn.text, boolean: sn.boolean }),
        });
        if (res.ok) {
          setSuccess("Phone number updated successfully");
        } else {
          setError("Failed to update phone number");
        }
      }
    })
  }
  return (
    <div className="flex flex-col w-full gap-4 items-center">
      <h1 className="text-2xl font-bold">Redes sociales</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl w-full flex flex-col gap-4">
        {socialNetworkStates.map(sn => {
          return (
            <div key={sn.key} className="flex items-center gap-2">
              <label htmlFor={`${sn.key}Link`} className="font-medium">{sn.socialNetwork}</label>
              <TextInput
                id={`${sn.key}Link`}
                type="text"
                placeholder={`Enlace de ${sn.socialNetwork}`}
                value={sn.text}
                onChange={e => {
                  const updatedStates = socialNetworkStates.map(s =>
                    s.key === sn.key ? { ...s, text: e.target.value } : s
                  );
                  setSocialNetworkStates(updatedStates);
                }}
              />
              <div className="flex items-center">
                <input
                  id={`${sn.key}Visible`}
                  type="checkbox"
                  checked={sn.boolean}
                  onChange={e => {
                    const updatedStates = socialNetworkStates.map(s =>
                      s.key === sn.key ? { ...s, boolean: e.target.checked } : s
                    );
                    setSocialNetworkStates(updatedStates);
                  }}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <label htmlFor={`${sn.key}Visible`} className="ml-2">Visible</label>
              </div>
            </div>
          );
        })}
        <Button gradientDuoTone="purpleToPink" outline type="submit">
          Save
        </Button>
      </form>
      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
    </div >
  );
}
