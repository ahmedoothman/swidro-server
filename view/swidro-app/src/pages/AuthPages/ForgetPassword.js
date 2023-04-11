import React from 'react';
// styles
import styles from './ForgetPassword.module.scss';

const ForgetPassword = React.memo(() => {
    return (
        <div className={styles.ForgetPassword}>
            <h1>--------------------</h1>
            <h1>ForgetPassword</h1>
        </div>
    );
});

export { ForgetPassword };
