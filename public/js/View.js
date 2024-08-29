class View {
  constructor({ id, html, mounted }) {
    this.id = id;
    this.html = html;
    this.mounted = mounted;
  }

  append() {
    if (document.getElementById(this.id)) {
      return;
    }
    
    this.$el = document.createElement('div');
    this.$el.id = this.id;
    this.$el.innerHTML = this.html;
    document.body.append(this.$el);

    if (this.mounted) {
      this.mounted();
    }
  }

  remove() {
    if (this.$el) {
      this.$el.remove();
    }
  }
}

export default View;