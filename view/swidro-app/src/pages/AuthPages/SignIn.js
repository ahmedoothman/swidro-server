import React from 'react';
// styles
import styles from './SignIn.module.scss';

const SignIn = React.memo(() => {
    return (
        <div className={styles.signIn}>
            <h1>--------------------</h1>
            <h1>SignIn</h1>
        </div>
    );
});

export { SignIn };
