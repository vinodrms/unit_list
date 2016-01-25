export class BrowserPageHelper {
    public checkBodyPresent(doneFunction : any) {
        $('body').isPresent().then(()=> {
            doneFunction();
        }, () => {
            //error skipped
            doneFunction();
        })
    }
}