// react router
import { Outlet } from 'react-router-dom';
// styles
import styles from './index.module.scss';
const AuthPages = () => {
    return (
        <div className={styles.authPages}>
            <h1>Swidro</h1>
            <h1>--------------------</h1>
            <h1>AuthPages</h1>
            <Outlet />
        </div>
    );
};

export default AuthPages;
