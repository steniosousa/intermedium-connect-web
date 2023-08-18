export function User({name,hash,active,onRedirect,user}){

  function redirect(){
    onRedirect(user)
  }
    return(
        <button onClick={() => redirect()} className="bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow-lg relative ring-2 ring-blue-500 focus:outline-none">
              <div className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" className="w-7 h-7 mr-2 rounded-full" alt="profile" />
               {name}
              </div>
              <div className="flex items-center w-full">
                {active?(
                    <div className="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-green-100 text-green-600 rounded-md">Ativo</div>

                ):(
                    <div className="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-red-100 text-orange-600 rounded-md">Inativo</div>

                )}
                <div className="ml-auto text-xs text-gray-500">Chave de acesso: {hash}</div>
              </div>
            </button> 
    )
}