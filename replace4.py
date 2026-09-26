import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

old_1 = '''function AppContent() {
  const { user, logout } = React.useContext(AuthContext);'''

new_1 = '''function AppContent() {
  const { user, loading, logout } = React.useContext(AuthContext);'''

content = content.replace(old_1, new_1)
content = content.replace('const { user, logout } = React.useContext(AuthContext);', 'const { user, loading, logout } = React.useContext(AuthContext);')

old_2 = '''    const handleLogout = () => {
      logout();
      navigate('/');
      setMobileMenuOpen(false);
    };

    return ('''

new_2 = '''    const handleLogout = () => {
      logout();
      navigate('/');
      setMobileMenuOpen(false);
    };

    if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-blue-50"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-majustwe-blue"></div></div>;
    }

    return ('''

content = content.replace(old_2, new_2)

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
