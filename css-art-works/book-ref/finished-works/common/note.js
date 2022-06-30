function Note(demo, chapter, descriptions) {
    this.demo = demo

    this.loadCss = function() {
        let head = document.querySelector('head')
        let link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', '../common/note.css')
        head.appendChild(link)
    }

    this.loadData = function() {
        let head = document.querySelector('head')
        let script = document.createElement('script')
        script.setAttribute('src', '../common/note-data.js')
        head.appendChild(script)
    }

    this.injectHtml = function() {
        let item = data.filter((item) => item[0] == this.demo)[0]
        let demo = item[0]
        let chapter = item[1]
        let descriptions = item[2].reduce(function(acc, cur) {
            return acc + '<p>' + cur + '</p>'
        }, '')

        let template = `
            <div class="meta">
                <h2>例${demo}</h2>
                <p class="chapter">
                    所在章节
                    <span class="number">${chapter}</span>
                </p>
            </div>
            <div class="description">
                <p>${descriptions}</p>
            </div>`
        let footer = document.createElement('footer')
        footer.className = 'note'
        footer.innerHTML = template
        document.querySelector('body').appendChild(footer)
    }

    this.render = function() {
        this.loadCss()
        this.loadData()
        let me = this
        window.addEventListener('load', function() {
            me.injectHtml()
        })
    }
}