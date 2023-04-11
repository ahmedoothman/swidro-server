import React from 'react';
// styles
import styles from './SignUp.module.scss';

const SignUp = React.memo(() => {
    return (
        <div className={styles.signUp}>
            <h1>--------------------</h1>
            <h1>SignUp</h1>
        </div>
    );
});

export { SignUp };
