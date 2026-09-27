import codecs

content = codecs.open('frontend/src/pages/MemberDashboard.tsx', 'r', 'utf-8').read()

target_remove = """  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-majustwe-blue"></div>
      </div>
    );
  }"""
content = content.replace(target_remove, "")

# Insert it after the hooks
target_insert = """  // Derived data
  const myContributions = contributions.filter(c => c.member === profile?.id);
  const officials = members.filter(m => m.user?.role === 'SECRETARY' || m.user?.role === 'TREASURER');"""

replacement_insert = """  // Derived data
  const myContributions = contributions.filter(c => c.member === profile?.id);
  const officials = members.filter(m => m.user?.role === 'SECRETARY' || m.user?.role === 'TREASURER');

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-majustwe-blue"></div>
      </div>
    );
  }"""

content = content.replace(target_insert, replacement_insert)

# I should also fix profile.id references in derived data to profile?.id if not already
content = content.replace("c.member === profile.id", "c.member === profile?.id")

codecs.open('frontend/src/pages/MemberDashboard.tsx', 'w', 'utf-8').write(content)
print("Fixed Rules of Hooks violation in MemberDashboard")
