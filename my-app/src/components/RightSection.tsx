import React from 'react';

const RightSection = () => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/10 p-8 h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-white mb-4">Track Your Progress</h2>
      <p className="text-blue-200/70 mb-6">
        Discover smarter ways to reach your fitness goals with our advanced tools.
      </p>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        <FeatureCard
          icon={<CheckIcon />}
          title="Personalized Workouts"
          description="Get custom workout plans tailored to your goals and fitness level."
          color="blue"
        />
        <FeatureCard
          icon={<ChartIcon />}
          title="Progress Tracking"
          description="See your progress with clear visual stats and analytics."
          color="purple"
        />
        <FeatureCard
          icon={<CommunityIcon />}
          title="Community Support"
          description="Connect with others for motivation and support."
          color="emerald"
        />
      </div>
      {/* Testimonials Section */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex flex-col gap-6 md:flex-row md:gap-4 items-center justify-between">
          <Testimonial
            name="Maria Rodriguez"
            text="This app has completely transformed my fitness routine. I've never been more consistent!"
            icon={<UserIcon1 />}
          />
          <Testimonial
            name="James Lee"
            text="Tracking my progress visually keeps me motivated every week."
            icon={<UserIcon2 />}
          />
          <Testimonial
            name="Sofia Chen"
            text="The community support is amazing—I'm never alone on my journey!"
            icon={<UserIcon3 />}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <div className="flex items-start group">
      <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colors[color]} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
        <p className="mt-1 text-blue-200/70">{description}</p>
      </div>
    </div>
  );
};

type TestimonialProps = {
  name: string;
  text: string;
  icon: React.ReactNode;
};

const Testimonial = ({ name, text, icon }: TestimonialProps) => (
  <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4 shadow-inner w-full md:w-auto">
    <div className="relative w-12 h-12 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-white font-medium leading-tight">{name}</p>
      <p className="text-blue-200/70 text-sm mt-1">{text}</p>
    </div>
  </div>
);

const UserIcon1 = () => (
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm"></div>
    <img
      src="https://randomuser.me/api/portraits/women/44.jpg"
      className="relative rounded-full w-full h-full object-cover border-2 border-white/10"
      alt="Maria Rodriguez"
    />
  </div>
);

const UserIcon2 = () => (
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-sm"></div>
    <img
      src="https://randomuser.me/api/portraits/men/32.jpg"
      className="relative rounded-full w-full h-full object-cover border-2 border-white/10"
      alt="James Lee"
    />
  </div>
);

const UserIcon3 = () => (
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-sm"></div>
    <img
      src="https://randomuser.me/api/portraits/women/68.jpg"
      className="relative rounded-full w-full h-full object-cover border-2 border-white/10"
      alt="Sofia Chen"
    />
  </div>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

export default RightSection;
