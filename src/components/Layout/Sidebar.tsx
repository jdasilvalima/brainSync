import { RxBookmarkFilled , RxDashboard, RxQuestionMarkCircled, RxCardStack, RxMix } from "react-icons/rx";

export function Sidebar() {
  const menuItems = [
    { name: 'Paths', icon: RxDashboard },
    { name: 'Quiz', icon: RxQuestionMarkCircled  },
    { name: 'Flashcards', icon: RxCardStack },
    { name: 'Mind Map', icon: RxMix },
  ]

  return (
    <div className="w-16 md:w-60 bg-white shadow-md flex flex-col items-center h-full">
      <div className="mb-8 flex justify-center w-full pt-6">
        <RxBookmarkFilled className="h-8 w-8"/>
      </div>
      <nav className="w-full flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center justify-center md:justify-start py-2 px-4 rounded hover:bg-gray-100 transition-colors ${
                  index === 0 ? 'font-semibold' : ''
                }`}
              >
                <item.icon className="h-6 w-6 md:mr-2" />
                <span className="hidden md:inline">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}