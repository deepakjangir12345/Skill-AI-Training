const StatsCards = () => {
  const stats = [
    {
      title: "My Courses",
      value: "5",
      icon: "📚",
    },
    {
      title: "Completed",
      value: "2",
      icon: "🎓",
    },
    {
      title: "Progress",
      value: "40%",
      icon: "📈",
    },
    {
      title: "Certificates",
      value: "1",
      icon: "🏆",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((item, index) => (
        <div className="stat-card" key={index}>
          <h2>{item.icon}</h2>

          <h3>{item.value}</h3>

          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;