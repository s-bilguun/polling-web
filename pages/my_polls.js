import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import moment from 'moment';
import Header from './Header';

const MyPolls = () => {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editedPolls, setEditedPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('http://localhost:8001/poll/myPolls', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPolls(response.data.myPollz);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPolls();
  }, [user.token]);

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
        await axios.put(
          `http://localhost:8001/poll/updatePoll/${pollId}`,
          editedPoll,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
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
  };

  const handleDelete = async (pollId) => {
    try {
      await axios.delete(`http://localhost:8001/poll/${pollId}/deletePoll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event, pollId) => {
    const { name, value } = event.target;
    const updatedPolls = polls.map((poll) => {
      if (poll.id === pollId) {
        return {
          ...poll,
          [name]: value,
        };
      }
      return poll;
    });
    setEditedPolls(updatedPolls);
  };

  const getStatus = (poll) => {
    const currentDateTime = moment();
    const startDateTime = moment(poll.startdate);
    const endDateTime = moment(poll.expiredate);
    if (currentDateTime.isBetween(startDateTime, endDateTime)) {
      return 'Active';
    } else {
      return 'Inactive';
    }
  };

  return (
    <div>
      <Header />
      <h2>My Polls</h2>
      <table>
        <thead>
          <tr>
            <th>Poll Question</th>
            <th>Start Datetime</th>
            <th>End Datetime</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {polls && polls.length > 0 ? (
            polls.map((poll) => (
              <tr key={poll.id}>
                <td>
                  {editMode[poll.id] ? (
                    <input
                      type="text"
                      name="question"
                      value={poll.question}
                      onChange={(e) => handleInputChange(e, poll.id)}
                    />
                  ) : (
                    poll.question
                  )}
                </td>
                <td>{poll.startdate}</td>
                <td>{poll.expiredate}</td>
                <td>{getStatus(poll)}</td>
                <td>
                  {editMode[poll.id] ? (
                    <>
                      <button onClick={() => handleSave(poll.id)}>Save</button>
                      <button
                        onClick={() =>
                          setEditMode((prevEditMode) => ({
                            ...prevEditMode,
                            [poll.id]: false,
                          }))
                        }
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(poll.id)}>Edit</button>
                      <button onClick={() => handleDelete(poll.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No polls found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyPolls;
