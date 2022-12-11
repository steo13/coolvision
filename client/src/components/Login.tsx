import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login'
import { useNavigate } from 'react-router-dom';
import env from './../environment';

interface Props {
    login: boolean,
    setLogin: (value: boolean) => void
}

function Login ({login}: Props) {
    const navigate = useNavigate()

    const google = () => {
        window.open(`${env.server.scheme}://${env.server.host}:${env.server.port}/auth/google`, "_self");
    };

    useEffect(() => {
        if (login)
            navigate('/')
    }, [login, navigate]);

    return (
        <>
            {
                !login ?
                    <div style={{display: 'flex', height: '100vh', backgroundColor: '#012c59', justifyContent: 'center'}}>
                        <div className='row'>
                            <div className='col'>
                                <div className='row'>
                                    <img alt="" src='logo.png'/>
                                </div>
                                <div className='row justify-content-center'>
                                    <div className='col-auto'>
                                        <GoogleLogin
                                            style={{width: '20px'}}
                                            clientId='95088355443-c9eabueth1ldnr7u09pvsd6up04t9s82.apps.googleusercontent.com'
                                            buttonText='Sign in with Google'
                                            onRequest={google}
                                        />
                                    </div>
                                </div>
                                <div className='mt-3 row justify-content-center'>
                                    <div className='col-auto'>
                                        <Typography color='white'>Only <b>@coolshop.it</b> accounts are allowed</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div>Loading ...</div>
            }
        </>
    )
}

export default Login