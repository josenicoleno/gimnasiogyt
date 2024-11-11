import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsappButton() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [textMessage, setTextMessage] = useState(``);
    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const res = await fetch(`/api/param/wppPhoneNumber`);
                if (res.ok) {
                    const data = await res.json();
                    setPhoneNumber(data.text);
                }

            } catch (error) {
                console.log(error.message)
            }
        };
        const fetchTextMessage = async () => {
            try {
                const res = await fetch(`/api/param/wppTextMessage`);
                if (res.ok) {
                    const data = await res.json();
                    setTextMessage(data.text);
                }
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchPhoneNumber();
        fetchTextMessage();
    }, []);

    return (
        <>{phoneNumber &&
            <a
                href={`https://wa.me/${phoneNumber}?text=${textMessage}`}
                target="_blank"
                rel="noreferrer noopener"
                className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366]"
            >
                <div className="relative z-20">
                    <i><FaWhatsapp className='w-16 h-16' /></i>
                </div>
            </a>
        }
        </>
    )
}
