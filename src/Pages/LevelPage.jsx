// show all levels to admin and user will click the level and then questions of that level will be shown
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import SpaceBackground from '../components/space-background';
import axios from 'axios';
import { GET_ALL_LEVELS,ADD_LEVEL } from '../constants';
import { useNavigate } from 'react-router-dom';

export default function Levels() {
    const [levels, setLevels] = useState([


    ]);
    const navigate = useNavigate();
   
    useEffect(() => {
        fetchLevels();
        return(
            setLevels([])
        )
    }, []);

    const fetchLevels = async () => {
        try {
            const response = await axios.get(GET_ALL_LEVELS, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'

                }
            });
            if(response.status===401){
                navigate("/login");
            }
            console.log("LEVELS: ", response.data);

            response.data.levels.forEach(level => {
                setLevels(prevLevels => [...prevLevels, {
                    mongoLevelId: level._id,
                    id: level.level,
                    questionCount: level.questions.length
                }]);
            });

            // setLevels(response.data);
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
        }

    };

     // add levels
     const addNewLevel =async ()=>{
        const maxLevel = levels.length > 0 ? Math.max(...levels.map(l => l.id)) : 0;
        console.log(`max level ${maxLevel}`);
        const newLevel = maxLevel+1;
        try{
            const response = await axios.post(ADD_LEVEL,{level:newLevel},{
                withCredentials:true,
                headers:{ 'Content-Type': 'application/json' }
            });
            if(response.status===201){
                setLevels([]);
                fetchLevels();
            }
        }catch(error){
            console.error('Error:', error.response?.data || error.message);
        }
    }

    return (
        <div className="container mx-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-white text-2xl font-bold">Levels</h1>
                <button
                    onClick={addNewLevel}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    Add New Level
                </button>
            </div>
            <h1 className="text-white text-2xl font-bold mb-4">Levels</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {levels.map((level) => (
                    <div
                        key={level.id}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">Level {level.id}</h2>
                        <p className="text-gray-300 mb-4">{level.questionCount} Questions</p>
                        <Link
                            to={`/level/${level.id}/questions/${level.mongoLevelId}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg block text-center"
                        >
                            View Questions
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

