'use client'
import axios from 'axios'
import { url } from 'inspector'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

function VerifyEmail() {
	const searchParams = useSearchParams()
	const urlToken = searchParams.get('token') as string | null

	const [token, setToken] = React.useState<string | null>("")
	const [verified, setVerified] = React.useState<boolean>(false)
	const [error, setError] = React.useState<{
		status: boolean
		message: string
	}>({
		status: false,
		message: '',
	})

	const verifyUserEmail = async (token: string) => {
		try {
			await axios.post('/api/users/verifyemail', {
				token,
			})
			setVerified(true)
			setError({status: false, message: ''})
		} catch (err: any) {
			setError({status: true, message: err.response.data.error})
			if(err.response.data.verified) {
				setVerified(true)
			}
			console.error(err.response.data)
		}
	}

	React.useEffect(() => {
		setError({status: false, message: ''})
		setToken(urlToken)
		if (urlToken) {
			verifyUserEmail(urlToken)
		}
	}, [urlToken, token])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1 className='text-4xl'>Verify Email</h1>
			
			{verified && 
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<h2>{error.status ? 'Email Already Verified!' : 'Email Verified!'}</h2>
					<Link href='/login'>Login</Link>
				</div>
			}
			
			{(error.status && !verified) && 
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<h2>Error</h2>
					<p>{error.message}</p>
				</div>
			}
			
        </div>
    )
}

export default VerifyEmail
