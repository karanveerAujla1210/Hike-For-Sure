import Navbar from './Navbar';

export default function StickyNavbar(props) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-xl">
      <Navbar {...props} />
    </div>
  );
}
