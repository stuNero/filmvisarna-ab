import { useState } from 'react';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';

LoginPage.route = {
  path: '/logga-in'
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
}
