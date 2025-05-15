import { useEffect, useState } from 'react';
import { Alert, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner() {
  const { currentUser } = useSelector((state) => state.user);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = async (result) => {
    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess('¡Entrada registrada con éxito!');
      setScanResult(result);
    } catch (error) {
      setError('Error al registrar la entrada');
    }
  };

  const onScanFailure = (error) => {
    console.warn(`Error al escanear: ${error}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Registro de Presentismo</h1>
      {error && <Alert color="failure">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <div id="reader" className="w-full max-w-md"></div>
      {scanResult && (
        <div className="mt-4">
          <p>Resultado del escaneo: {scanResult}</p>
        </div>
      )}
    </div>
  );
} 