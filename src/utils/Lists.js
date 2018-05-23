const Lists = {
    saveToList: function(_what, _where, _id) {
        var schemma = JSON.parse(localStorage.getItem('client')).listData[_where][_what];
        schemma.sort(function(a,b) {
            var x = typeof a.folder !== 'undefined' ? a.folder.toLowerCase() : a.name[localStorage.getItem('language')].toLowerCase();
            var y = typeof b.folder !== 'undefined' ? b.folder.toLowerCase() : b.name[localStorage.getItem('language')].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        })
        console.log(schemma);
        return schemma
    }
}
export default Lists