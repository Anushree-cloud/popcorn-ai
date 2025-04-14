"use client";
import { Typography, Box, Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
    const router = useRouter()
    const [userData, setUserData] = useState<any>(null)
    const [showData, setShowData] = useState<boolean>(false)

    const fetchUserData = async () => {
        try {
            const response = await axios.post("/api/users/me")
            setUserData(response.data.data)
            console.log("User Data", response.data.data)
        } catch (err: any) {
            console.error(err.response.data)
            toast.error("Error fetching user data")
        }
    }

    const onLogout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("Logged out successfully!")
            router.push("/login")
        } catch (err: any) {
            console.error(err.response.data)
            toast.error("Logout Failed!")
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Dashboard
            </Typography>

            <Typography variant="h5" gutterBottom>
                Welcome {userData?.name}!
            </Typography>

            {showData && <pre>{JSON.stringify(userData, null, 2)}</pre>}

            <Button onClick={() => setShowData(!showData)} variant="contained" color="warning">
                {showData ? "Hide Data" : "User Data"}
            </Button>

            <Button onClick={onLogout} variant="contained" color="primary">
                Logout
            </Button>
        
        </Box>
    )
};

export default Dashboard;
