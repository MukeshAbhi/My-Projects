import { User } from "../types"

type ProfileCardProps = {
    user: User | null;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {

    if (!user) return <p>No user data</p>; // Handle null case

    return(
        <div>
            
        </div>
    )
};