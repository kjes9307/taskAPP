import React from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { ProjectModal } from "component/modal"

import {AuthHeader} from 'component/auth-header';
import {Task} from 'auth/Homepage'

export const Main =() =>{
    
    return (
        <BrowserRouter>
            <AuthHeader />
                <Routes>
                    <Route index element={<Task />} ></Route>
                </Routes>
            <ProjectModal projectModalOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </BrowserRouter>
    )
}