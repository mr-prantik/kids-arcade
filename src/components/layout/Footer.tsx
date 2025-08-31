export default function Footer() {
  return (
    <footer className="bg-black/50 text-center py-4 mt-8 border-t border-purple-800">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} webuildd · Made with ❤️ for kids
      </p>
    </footer>
  );
}
