import { Alert, Button, Select, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreatePersonalRecord() {
    const { currentUser } = useSelector((state) => state.user);
    const { recordId } = useParams();
    const [formData, setFormData] = useState({
        userId: currentUser._id,
        exerciseId: "",
        weight: "", // en kg o lb
        reps: "", // repeticiones
        time: "", // tiempo si aplica
        date: new Date().toISOString().split('T')[0],
        createdBy: currentUser._id,
    });

    const [exercises, setExercises] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

    // Fetch ejercicios y usuarios
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const exerciseRes = await fetch("/api/exercise/getexercises")
                const exerciseData = await exerciseRes.json();
                setExercises(exerciseData.exercises);
                if (currentUser.isAdmin) {
                    const usersRes = await fetch("/api/user/getusers?sort=asc")
                    const userData = await usersRes.json();
                    setUsers(userData.users);
                } else {
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser.isAdmin]);
    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    // Enviar datos al servidor
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPublishError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/personalRecord`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    record: {
                        weight: formData.weight,
                        reps: formData.reps,
                        time: formData.time
                    }
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            navigate("/dashboard?tab=personalRecords");
        } catch (error) {
            setPublishError("Error saving the record");
        } finally {
            setLoading(false);
        }
    };
    return (
        loading ? (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        ) : (
            <div className="p-3 max-w-3xl mx-auto min-h-screen">
                <h1 className="text-center text-3xl my-7 font-semibold">
                    Nueva Marca Personal
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Select
                        id="exerciseId"
                        required
                        onChange={handleChange}
                        value={formData.exerciseId}
                    >
                        <option value="">Selecciona un ejercicio</option>
                        {exercises?.map((exercise) => (
                            <option key={exercise._id} value={exercise._id}>
                                {exercise.title}
                            </option>
                        ))}
                    </Select>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <TextInput
                            id="weight"
                            type="number"
                            placeholder="Peso (kg)"
                            required
                            className="flex-1"
                            value={formData.weight}
                            onChange={handleChange}
                        />
                        <TextInput
                            id="reps"
                            type="number"
                            placeholder="Repeticiones"
                            required
                            className="flex-1"
                            value={formData.reps}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <TextInput
                            id="date"
                            type="date"
                            required
                            className="flex-1"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    {currentUser.isAdmin && (
                        <Select
                            id="userId"
                            required
                            onChange={handleChange}
                            value={formData.userId}
                        >
                            <option value="">Selecciona un usuario</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username}
                                </option>
                            ))}
                        </Select>
                    )}

                    <Button type="submit" gradientDuoTone="purpleToPink">
                        Guardar Marca Personal
                    </Button>
                    {publishError && (
                        <Alert color="failure" className="mt-4">
                            {publishError}
                        </Alert>
                    )}
                </form>
            </div>
        )
    );
}
