import { useEffect, useState } from "react";
import Line from "../line"
import Solicitation from "../solicitation";
import Api from "../../api/service";
import Alert from "../alert";

export function Center({ user }) {
  const [showSolicitation, setShowSolicitation] = useState(false);
  const [allDatas, setAllDatas] = useState(null)
  const [copy, setCopy] = useState('Copiar')
  const [loading, setLoading] = useState(false)

  function handleSolicitation() {
    getDatas()
    setShowSolicitation(!showSolicitation);
  }

  async function copyHash() {
    const copiar = allDatas.loginHash
    try {
      await navigator.clipboard.writeText(copiar);
      setCopy('Copiado')
    } catch (error) {
      console.error('Erro ao copiar texto para a área de transferência:', error);
    }
  }

  function closeAlert() {
    setLoading(false)
  }

  async function getDatas() {
    setLoading(true)
    try {
      const { data } = await Api.get('manager/users', { params: { id: user.managerId } })
      setLoading(false)
      const filter = data.users.find((item) => user.id == item.id)

      setAllDatas(filter)
    } catch (error) {
      window.alert('erro')
    }
  }

  useEffect(() => { getDatas() }, [user])
  useEffect(() => { setAllDatas(user) }, [])

  return (
    <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
      {loading ? (
        <div class="text-center">
          <div role="status">
            <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      {showSolicitation && <Solicitation onClose={handleSolicitation} showModal={showSolicitation} datas={allDatas} />}
      <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
        <div className="flex w-full items-center">
          <div className="flex items-center text-3xl text-gray-900 dark:text-white">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" className="w-12 mr-4 rounded-full" alt="profile" />
            {allDatas && allDatas.name}
          </div>
          <div className="ml-auto sm:flex hidden items-center justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-400 dark:text-gray-400">Chave de acesso</div>
              <div className="text-gray-900 text-lg dark:text-white">{allDatas && allDatas.loginHash}</div>
            </div>
            <button onClick={copyHash} className="w-12 h-12 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <span>{copy}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3 ">
          <a href="#" className="px-3 border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white pb-1.5">Histórico</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 line-through">Quadro de ponto</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden line-through">Cronograma</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden line-through">Notificações</a>
          <a href="#" onClick={handleSolicitation} className="px-3 border-b-2 border-transparent text-white  pb-1.5 sm:block hidden bg-blue-500 rounded-md shadow py-2 m-4 ">Nova solicitação</a>
        </div>
      </div>
      <div className="sm:p-7 p-4">
        <div className="flex w-full items-center mb-7">
          <button className="inline-flex line-through mr-3 items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0">
            <svg viewBox="0 0 24 24" className="w-4 mr-2 text-gray-400 dark:text-gray-600" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Sem data determinada
            <svg viewBox="0 0 24 24" className="w-4 ml-1.5 text-gray-400 dark:text-gray-600" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {/* <button className="inline-flex items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0">
              Filter by
              <svg viewBox="0 0 24 24" className="w-4 ml-1.5 text-gray-400 dark:text-gray-600" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button> */}
          <div className="ml-auto text-gray-500 text-xs sm:inline-flex hidden items-center">
            {allDatas && allDatas.active ? (
              <span className="inline-flex mr-2 bg-green-300 p-8 items-center h-8 w-8 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">Ativo</span>

            ) : (
              <span className="inline-flex mr-2 bg-orange-300 p-8 items-center h-8 w-8 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">Inativo</span>

            )}
            {/* <button className="inline-flex mr-2 items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">
                <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">
                <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button> */}
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Início</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Ambiente</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">Status</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Evidencias</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400 text-white">Atualização</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-100">
            {allDatas && allDatas.Cleaning.map((clear) => {
              return (
                <Line clean={clear} key={clear.id} managerId={allDatas.managerId} reload={getDatas} />
              )
            })}
          </tbody>
        </table>
        {/* <div className="flex w-full mt-5 space-x-2 justify-end">
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">
              <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">1</button>
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-white leading-none">2</button>
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">3</button>
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">4</button>
            <button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">
              <svg className="w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div> */}
      </div>
    </div>
  )
}