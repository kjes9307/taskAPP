export const UnAuthHeader = () =>{
    const setOpen = () =>{
        var menu = document.getElementsByClassName('dropdown-self')[0]
        menu.classList.toggle('active-self')
    }
    return (
        <header className="sticky-top mb-8">
            <div className="position-relative d-sm-flex justify-content-sm-between align-items-sm-center">
                <h1 className="text-center text-lg-start mb-0">
                <a href="#home" className="brand-color text-decoration-none click">DETAILS</a>
                </h1>
                <ul className="d-none d-sm-block d-sm-flex mb-0">
                    <li className="list-unstyled "><a href="/" className="text-decoration-none fs-6 brand-color click">首頁</a></li>
                    <li className="list-unstyled ms-7"><a href="/login" className="text-decoration-none fs-6 brand-color click">登入</a></li>
                </ul>
                <div className="toggle-dropdown position-absolute top-0 end-0 d-block d-sm-none" onClick={()=> setOpen()}>
                    <a href="/" className="ham-icon brand-color">
                        <i className="fas fa-bars fa-2x"></i>
                    </a>
                    <ul className="dropdown-self px-0">
                        <li className="py-4 border-bottom"><a href="/" className="text-decoration-none text-secondary fs-5">首頁</a></li>
                        <li className="d-flex align-items-center justify-content-center py-4 border-bottom">
                            <span className="material-symbols-outlined text-secondary">
                                person
                            </span>
                            <a href="/login" className="text-decoration-none text-secondary fs-5">
                                登入
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}