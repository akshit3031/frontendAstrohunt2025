import React from 'react';
import {useNavigate} from 'react-router-dom';
import TeamSelectionModal from '../components/TeamSelectionModal';
import SpaceBackground from '../components/space-background';

const TeamSelectionPage = () => {
    const navigate = useNavigate();

    const handleTeamModalClose = () => {
        navigate('/game');
    };

    return (
        <>
            <SpaceBackground />
            <TeamSelectionModal 
                isOpen={true}
                onClose={handleTeamModalClose}
            />
        </>
    )   
};
export default TeamSelectionPage;