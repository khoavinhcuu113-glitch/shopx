import { C } from '../constants';
import { Btn, Btn2 } from './UI';

export default function LoginPopup({ onLogin, onRegister, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={onClose}>
      <div style={{ background: C.w, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.t, marginBottom: 6 }}>Đăng nhập để tiếp tục</h3>
        <p style={{ fontSize: 13, color: C.m, marginBottom: 16 }}>Bạn cần đăng nhập để thực hiện thao tác này trên ShopX.</p>
        <Btn onClick={onLogin} style={{ marginBottom: 8 }}>Đăng nhập ngay</Btn>
        <Btn2 onClick={onRegister} style={{ marginBottom: 8 }}>Tạo tài khoản mới</Btn2>
        <button onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 13, cursor: 'pointer', padding: 6 }}>
          Tiếp tục xem không đăng nhập
        </button>
      </div>
    </div>
  );
}
