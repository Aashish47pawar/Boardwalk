import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar({ onNewTask }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark" />
        Boardwalk
      </div>

      <div className="nav-right">
        <button type="button" className="btn btn-primary" onClick={onNewTask}>
          + New task
        </button>
        {user && <span className="user-tag">{user.name}</span>}
        <button type="button" className="btn btn-ghost" onClick={() => dispatch(logout())}>
          Log out
        </button>
      </div>
    </header>
  );
}
