var socket = io();

$(function () {

  socket.on('connect', function () {
    console.log('Conectado al servidor.');
    $('#disconnected').hide();
    $('#waiting-room').show();
    $('#chat').hide()
  });

  socket.on('disconnect', function () {
    console.log('Desconectado del servidor.');
    $('#waiting-room').hide();
    $('#game').hide();
    $('#chat').hide()
    $('#disconnected').show();
  });

  socket.on('join', function (gameId) {
    Game.initGame();
    $('#messages').empty();
    $('#disconnected').hide();
    $('#waiting-room').hide();
    $('#game').show();
    $('#chat').show()
    $('#game-number').html(gameId);
  })

  socket.on('update', function (gameState) {
    Game.setTurn(gameState.turn);
    Game.updateGrid(gameState.gridIndex, gameState.grid);
  });

  socket.on('chat', function (msg) {
    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var periodo = (hora >= 12) ? 'p. m.' : 'a. m.';

    hora = (hora % 12 === 0) ? 12 : hora % 12;
    minutos = (minutos < 10) ? '0' + minutos : minutos;

    var horaFormateada = `${hora}:${minutos} ${periodo}`;
    console.log(msg);
    if (msg.name === "Contrincante") {
      $('#messages').append('<div class="remote-message"><li><strong id="name">' + msg.name + ':</strong> ' + msg.message + '</li></div>');
      $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
    } else {
      $('#messages').append('<div class="local-message"><li><strong id="">' + msg.name + ':</strong> ' + msg.message + '</li></div>');
      $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
    }
  });

  socket.on('notification', function (msg) {
    $('#messages').append('<li>' +msg.message + '</li>');
    $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
  });

  socket.on('gameover', function (isWinner) {
    Game.setGameOver(isWinner);
  });

  socket.on('leave', function () {
    $('#game').hide();
    $('#waiting-room').show();
  });

  $('#message-form').submit(function () {
    socket.emit('chat', $('#message').val());
    $('#message').val('');
    return false;
  });

});

function sendLeaveRequest(e) {
  e.preventDefault();
  socket.emit('leave');
}

/**
 * Send shot coordinates to server
 * @param {type} square
 */
function sendShot(square) {
  socket.emit('shot', square);
}
