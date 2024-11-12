import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export const DashContact = () => {
  const { currentUser } = useSelector(state => state.user)
  const [contacts, setContacts] = useState([]);
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [contactIdToDelete, setContactIdToDelete] = useState(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(`/api/contact?sort=desc`)
        if (res.ok) {
          const data = await res.json();
          setContacts(data.contacts)
          if (data.contacts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchContacts();
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = contacts.length;
    try {
      const res = await fetch(`/api/contact?sort=desc&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setContacts(prev => [...prev, ...data.contacts]);
        if (data.contacts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`api/contact/delete/${contactIdToDelete}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        setContacts(prev => prev.filter(contact => contact._id !== contactIdToDelete))
      }
    } catch (error) {
      console.log(error.message)
    }
    setShowModal(false)
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 darkscrollbar-thumb-slate-500">
      {currentUser.isAdmin && contacts.length > 0 ?
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {contacts.map(contact =>
                <Table.Row key={contact._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  {/* Date */}
                  <Table.Cell>{new Date(contact.updatedAt).toLocaleDateString()}</Table.Cell>
                  {/* username */}
                  <Table.Cell className="line-clamp-1">
                    {contact.userUsername || contact.name}
                  </Table.Cell>
                  {/* Email */}
                  <Table.Cell >
                    {contact?.email}
                  </Table.Cell>
                  {/* Phone */}
                  <Table.Cell className="line-clamp-2">
                    <Link
                      to={`https://wa.me/${contact?.phone}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {contact?.phone}
                    </Link>
                  </Table.Cell>
                  {/* Type */}
                  <Table.Cell>{contact?.type}</Table.Cell>
                  {/* Content */}
                  <Table.Cell>{contact?.content}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setContactIdToDelete(contact._id)
                        setShowModal(true)
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {showMore && <>
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          </>
          }
        </>
        : <p>You have not contacts yet!</p>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header>Delete contact?</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure you want to delete the contact?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, I'm not.</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
