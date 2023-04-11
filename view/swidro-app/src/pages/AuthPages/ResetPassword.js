import React from 'react';
// styles
import styles from './ResetPassword.module.scss';
// react-router-dom
import { useParams } from 'react-router-dom';
const ResetPassword = React.memo(() => {
    // get params from url
    const { token } = useParams();
    return (
        <div className={styles.ResetPassword}>
            <h1>--------------------</h1>
            <h1>ResetPassword :: {token}</h1>
        </div>
    );
});

export { ResetPassword };
