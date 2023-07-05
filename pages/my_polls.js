import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Header from './Header';
import moment from 'moment';
import Link from 'next/link';

const MyPolls = () => {
    const { user } = useContext(AuthContext);
    const [polls, setPolls] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [editedPolls, setEditedPolls] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get('http://localhost:8001/poll/myPolls', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setPolls(response.data.polls);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPolls();
    }, [user.token, update]);

    const handleEdit = (pollId) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [pollId]: true,
        }));
    };
    const handleSave = async (pollId) => {
        try {
            const editedPoll = editedPolls.find((poll) => poll.id === pollId);
            if (editedPoll) {
                const response = await axios.put(
                    `http://localhost:8001/poll/updatePoll/${pollId}`,
                    {
                        ...editedPoll,
                        username: user.username,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                // Update the polls state with the new poll data
                setPolls((prevPolls) =>
                    prevPolls.map((poll) =>
                        poll.id === pollId ? { ...poll, ...response.data } : poll
                    )
                );

                setEditMode((prevEditMode) => ({
                    ...prevEditMode,
                    [pollId]: false,
                }));
                setEditedPolls((prevEditedPolls) =>
                    prevEditedPolls.filter((poll) => poll.id !== pollId)
                );
            }
        } catch (error) {
            console.log(error);
        }
        setUpdate((prevUpdate) => !prevUpdate);
    };

    const handleDelete = async (pollId) => {
        try {
          const confirmed = window.confirm('Энэ санал асуулгыг устгахдаа итгэлтэй байна уу?');
          if (confirmed) {
            await axios.delete(`http://localhost:8001/poll/${pollId}/deletePoll`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
          }
        } catch (error) {
          console.log(error);
        }
      };


    const handleInputChange = (event, pollId) => {
        const { name, value } = event.target;

        setEditedPolls((prevEditedPolls) => {
            const existingPoll = prevEditedPolls.find((poll) => poll.id === pollId);

            if (existingPoll) {
                return prevEditedPolls.map((poll) =>
                    poll.id === pollId ? { ...poll, [name]: value } : poll
                );
            } else {
                const newPoll = {
                    ...polls.find((poll) => poll.id === pollId),
                    [name]: value,
                };
                return [...prevEditedPolls, newPoll];
            }
        });
    };


    const getStatus = (poll) => {
        const currentDateTime = moment();
        const startDateTime = moment(poll.startdate);
        const endDateTime = moment(poll.expiredate);


        if (currentDateTime.isBetween(startDateTime, endDateTime)) {
            return `Идэвхтэй`;
        } else {
            return `Идэвхгүй`;
        }
    };

    return (
        <div>
            <Header />
            <div className="table-container">
                <table className="my-polls-table">
                    <thead>
                        <tr>
                            <th>Асуулт</th>
                            <th>Эхлэх цаг</th>
                            <th>Дуусах цаг</th>
                            <th>Төлөв</th>
                            <th>Үйлдэл</th>
                        </tr>
                    </thead>
                    <tbody>
                        {polls.map((poll) => (
                            <tr key={poll.id}>
                                <td>
                                    {editMode[poll.id] ? (
                                        <input
                                            type="text"
                                            name="question"
                                            value={
                                                editedPolls.find((p) => p.id === poll.id)?.question ||
                                                poll.question
                                            }
                                            onChange={(e) => handleInputChange(e, poll.id)}
                                        />
                                    ) : (
                                        <Link href={`/poll/${poll.id}`}>
                                            {poll.question}
                                        </Link>
                                    )}
                                </td>
                                <td>
                                    {editMode[poll.id] ? (
                                        <input
                                            type="datetime-local"
                                            name="startdate"
                                            value={moment(editedPolls.find((p) => p.id === poll.id)?.startdate || poll.startdate).format('YYYY-MM-DDTHH:mm')}
                                            onChange={(e) => handleInputChange(e, poll.id)}
                                        />
                                    ) : (
                                        moment(poll.startdate).format('YYYY-MM-DD HH:mm')
                                    )}
                                </td>
                                <td>
                                    {editMode[poll.id] ? (
                                        <input
                                            type="datetime-local"
                                            name="expiredate"
                                            value={moment(editedPolls.find((p) => p.id === poll.id)?.expiredate || poll.expiredate).format('YYYY-MM-DDTHH:mm')}
                                            onChange={(e) => handleInputChange(e, poll.id)}
                                        />
                                    ) : (
                                        moment(poll.expiredate).format('YYYY-MM-DD HH:mm')
                                    )}
                                </td>
                                <td>{getStatus(poll)}</td>
                                <td>
                                    {editMode[poll.id] ? (
                                        <>
                                            <button className="table-edit" onClick={() => handleSave(poll.id)}>Хадгалах</button>
                                            <button className="table-edit"
                                                onClick={() =>
                                                    setEditMode((prevEditMode) => ({
                                                        ...prevEditMode,
                                                        [poll.id]: false,
                                                    }))
                                                }
                                            >
                                               Цуцлах
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="table-edit" onClick={() => handleEdit(poll.id)}>Засах</button>
                                            <button className="table-delete" onClick={() => handleDelete(poll.id)}>Устгах</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default MyPolls;