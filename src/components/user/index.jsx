export function User({ name, hash,  onRedirect, user }) {

 
  function redirect() {
    onRedirect(user)
  }
  return (
    <>

      <button onClick={() => redirect()} className="bg-quaternary p-3 w-full flex flex-col rounded-md shadow-lg relative focus:outline-none">
        <div className="flex xl:flex-row flex-col items-center font-medium text-white pb-2 mb-2 xl:border-b border-gray-400 border-opacity-75 w-full">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" className="w-7 h-7 mr-2 rounded-full" alt="profile" />
          {name}
        </div>
        <div className="flex items-center w-full bg-transparent">
          <div className="ml-auto text-xs text-white">Chave de acesso: {hash}</div>
        </div>
      </button>
    </>
  )
}