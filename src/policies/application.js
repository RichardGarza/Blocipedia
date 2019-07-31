module.exports = class ApplicationPolicy {

  constructor( user, record, collaborator ) {
    this.user = user;
    this.record = record;
    this.collaborator = collaborator;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == 2;
  }

  _isMember() {
    return this.user && this.user.role == 0;
  }
  _isPremiumMember() {
    return this.user && this.user.role == 1;
  }
  
  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  viewCollab() {
    return this.show();
  }

  edit() {
    return this.new() &&
      this.record && ( this.collaborator || this._isOwner() || this._isAdmin() );
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}