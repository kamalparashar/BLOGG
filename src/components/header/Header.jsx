import React from "react";
import { Container, LogoutBtn, Logo } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container className={`mx-0 max-w-full flex justify-end`}>
        <nav className="flex">
          <div className="mr-4 sm:mr-0.5">
            <Link to="/">
              <Logo />
            </Link>
          </div>
        </nav>
        <ul className='flex ml-auto float-right'>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                onClick={()=> navigate(item.slug)}
                className='text-xl font-semibold inline-block px-3 py-2 duration-150 hover:bg-blue-100 rounded-full sm:p-2 sm:text-base sm:hover:bg-transparent sm:rounded-none sm:hover:underline'
                >
                  <span className="whitespace-nowrap">{item.name}</span>
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <li key='logout'>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </Container>
    </header>
  );
}

export default Header;