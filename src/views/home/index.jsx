import { useNavigate, useParams } from "react-router-dom";
import Api from "../../api/service";
import { useEffect, useState } from "react";
import { User } from "../../components/user";
import { Center } from "../../components/center";
import Admin from "../../components/Admin";
import LitleModal from "../../components/litleModal";
import React from "react";

export default function Home() {
  const navigate = useNavigate();
  const id = localStorage.getItem('token')
  const adminObj = JSON.parse(localStorage.getItem('manager'))

  if (!id) {
    navigate(`/`);
    return
  }
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [users, setUsers] = useState([])
  const [userWithFilter, setUserWithFilter] = useState([])
  const [userSelected, setUserSelected] = useState(null)
  const [admin, setAdmin] = useState({ companys: { id: adminObj.companyId, name: "" }, name: adminObj.name })
  const [filterUser, setFilterUser] = useState('')

  const [objectModal, setObjectModal] = useState(false)
  const [companyModal, setCompanyModal] = useState(false)
  const [adminModal, setAdminModal] = useState(false)
  const [placeModal, setPlaceModal] = useState(false)
  const updateWindowSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);



  async function getDatas() {
    try {
      const { data } = await Api.get('/user/allUsers', { params: { id } })
      setUsers(data)
      // setUserWithFilter(data) 

    } catch (error) {
      console.log(error)
    }
  }



  function handlePerfil() {
    console.log('po')
  }



  function handleObject() {
    setObjectModal(!objectModal)
  }

  function handleCompany() {
    setCompanyModal(!companyModal)
  }

  function handleAdmin() {
    setAdminModal(!adminModal)
  }

  function handlePlace() {
    setPlaceModal(!placeModal)
  }


  useEffect(() => {
    if(users == 'Sem usuários') return
    const filteredUsers = users.filter((item) =>
      item.name.toLowerCase().includes(filterUser.toLowerCase())
    );
    if (filteredUsers.length > 0) {
      setUserWithFilter(filteredUsers)
    } else {
      setUserWithFilter(users)
    }
  }, [filterUser, users])


  function handleLogin() {
    localStorage.clear()
    navigate(`/`);
  }

  useEffect(() => { getDatas() }, [])
  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm">

      {windowSize.width < 1026 ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-4">Abra no computador</h1>
            <p className="text-lg text-gray-700">Este conteúdo é melhor visualizado em telas maiores.</p>
            <p>Largura da tela: {windowSize.width}px</p>
            <p>Altura da tela: {windowSize.height}px</p>
          </div>
        </div>
      ) : null}

      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 w-20 flex-shrink-0 border-r border-gray-200 flex-col hidden sm:flex">
        <div className="h-16 text-blue-500 flex items-center justify-center">
          <img className="w-7 h-7 rounded-full" src="data:image/jpeg;base64,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" alt="profile" />
        </div>
        <div className="flex mx-auto flex-grow mt-4 flex-col text-gray-400 space-y-4">
          <button className="h-10 w-12 dark:text-gray-500 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <button className="h-10 w-12 dark:bg-gray-700 dark:text-white rounded-md flex items-center justify-center bg-blue-100 text-blue-500">
            <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </button>
          <button className="h-10 w-12 dark:text-gray-500 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </button>
          <button className="h-10 w-12 dark:text-gray-500 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden h-full flex flex-col">
        <div className="h-16 lg:flex w-full border-b border-gray-200 dark:border-gray-800 hidden px-10">
          <div className="flex h-full text-gray-600 dark:text-gray-400">
            < button className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Intermedium</button>
            <button className="cursor-pointer h-full border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white inline-flex mr-8 items-center">Usuário</button>
            <button onClick={handleObject} className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Objetos</button>
            <button onClick={handlePlace} className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Ambientes</button>
            <button onClick={handleCompany} className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Empresas</button>
            <button onClick={handleAdmin} className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Administradores</button>
          </div>
          {objectModal && <LitleModal companyId={admin.companys.id} onClose={handleObject} showModal={objectModal} action={'object'} text={"Informar Objeto"} />}
          {companyModal && <LitleModal companyId={admin.companys.id} onClose={handleCompany} showModal={companyModal} action={'company'} text={"Informar empresa"} />}
          {placeModal && <LitleModal companyId={admin.companys.id} onClose={handlePlace} showModal={placeModal} action={'place'} text={"Informar ambiente"} />}
          {adminModal && <Admin datas={admin.companys.id} onClose={handleAdmin} showModal={adminModal} />}

          <div className="ml-auto flex items-center space-x-7">

            <button className="flex items-center" onClick={handlePerfil}>
              <span className="relative flex-shrink-0">
                <img className="w-7 h-7 rounded-full" src="data:image/jpeg;base64,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" alt="profile" />
                <span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white dark:border-gray-900"></span>
              </span>
              <span className="ml-2" >{admin.name}</span>
              <svg viewBox="0 0 24 24" className="w-4 ml-1 flex-shrink-0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <button onClick={() => handleLogin()} className="h-8 px-3 rounded-md shadow text-white bg-blue-500">sair</button>

          </div>
        </div>
        <div className="flex-grow flex overflow-x-hidden">
          <div className="xl:w-72 w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto lg:block hidden p-5">
            {users == "Sem usuários" ? (
              <div className="text-xs text-gray-400 tracking-wider">Usuários cadastrados: 0</div>
            ) : (
              <div className="text-xs text-gray-400 tracking-wider">Usuários cadastrados: {users.length}</div>
            )}
            <div className="relative mt-2">
              <input onChange={(e) => setFilterUser(e.target.value)} type="text" className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm" placeholder="Search" />
              <svg viewBox="0 0 24 24" className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div className="space-y-4 mt-3">
              {users.length == 0?(
                <div class="text-center">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              ):users  == "Sem usuários"?(
                <div className="text-xs text-center text-gray-400 tracking-wider"> - Sem usuários no Aplicativo - </div>
              ):null}
              {userWithFilter && userWithFilter.map((user) => {
                return (
                  <User active={user.active} hash={user.loginHash} name={user.name} onRedirect={setUserSelected} user={user} key={user.id} />
                )
              })}
            </div>
          </div>

          {userSelected ? <Center user={userSelected} /> : null}
        </div>
      </div>
    </div>
  )
}
