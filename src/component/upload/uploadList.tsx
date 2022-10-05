import React, { FC } from "react";
import { UploadFile } from './index'
import Icon from 'component/Icon'
import {ProgressBar} from 'react-bootstrap'

interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (_file: UploadFile) => void;
}
// 13. 上傳列表
export const UploadList: FC<UploadListProps> = (props) => {
    const {
        fileList,
        onRemove,
    }  = props
    return (
        <ul className="list-unstyled">
            {fileList.map(item => {
                return (
                    <li key={item.uid}>
                        <span className={`file-name file-name-${item.status} me-2`}>
                            <Icon icon="file-alt" theme="secondary" />
                            {item.name}
                        </span>
                        <span className = "file-status">
                            {(item.status === 'uploading' || item.status === 'ready') && <Icon icon="spinner" spin theme="primary" />}
                            {item.status === 'success' && <Icon icon="check-circle" theme="warning" />}
                            {item.status === 'error' && <Icon icon="times-circle" theme="danger" />}
                        </span>
                        <span className="file-actions">
                            <Icon icon="times" onClick={() => { onRemove(item)}}/>
                        </span>
                        {item.status === 'uploading' &&
                            <ProgressBar
                                now={item.percent || 0}
                            />
                        }
                    </li>
                )
            })}
        </ul>
    )
}

export default UploadList;