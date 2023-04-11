import React from 'react';
// styles
import styles from './VerifyEmail.module.scss';
// react-router-dom
import { useParams } from 'react-router-dom';
const VerifyEmail = React.memo(() => {
    // get params from url
    const { token } = useParams();
    return (
        <div className={styles.VerifyEmail}>
            <h1>--------------------</h1>
            <h1>VerifyEmail :: {token}</h1>
        </div>
    );
});

export { VerifyEmail };
