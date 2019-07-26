import FormData from 'form-data';
import React from 'react'

export default function uploader(WrappedComponent, componentProps) {
    return class Upload extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showDialog: false
            }
        }

        async sendFile(url, file) {
            const form = new FormData();
            form.append('file', file);
            let options = {
              method: 'POST',
              body: form,
            }

            try {
                return await fetch(`http://${url}/medias`, options);
            } catch(err) {
                throw new Error(`UPLOAD: ${file.path} - ${err.statusCode} - ${err.statusMessage}`, `le fichier existe déjà, veuillez supprimer le médias ${file.name} avant de réessayer`);
            }
        }
        
        async upload(files){
            let res;
            // console.log("files : ",files);
            let taskName = "Uploading"
            this.props.onTaskStart(taskName);
            for(let f of files) {
                try{
                    res = await this.sendFile(this.props.url, f);
                }catch(err){
                    this.props.onTaskEnd(taskName, err);
                    return
                }
                //Emit a change event even if it failed
            }
            this.props.onTaskEnd(taskName);
            // this.dispatchEvent(new Event("change"));
            return res
        }

        showBoxDialog() {
            const fileSelector = document.createElement('input');
            fileSelector.setAttribute('type', 'file');
            fileSelector.setAttribute('multiple', 'multiple');
            fileSelector.addEventListener("change", async (evt)=>{
                await this.upload(evt.path[0].files);
            })
            fileSelector.click();
        }

        handleDrop(e) {
            e.preventDefault();
            this.upload(e.dataTransfer.files);
            return false;
        }

        render() {
            return (
                <div onDrop={this.handleDrop.bind(this)} onDragLeave={() => false} onDragEnter={() => false} onDragEnd={() => false}>
                    <WrappedComponent 
                        {...this.props} 
                        {...componentProps} 
                        onClick={() => this.showBoxDialog()}
                    />
                </div>
            ) 
        }
    }
}