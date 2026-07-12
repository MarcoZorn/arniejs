(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.getElementById('threadList');
  var composeForm = document.getElementById('composeForm');
  var composeInput = document.getElementById('composeInput');
  if (!list || !composeForm || !composeInput) return;

  var AVATAR_COLORS = ['#c4622d', '#5a7a3a', '#9b6b3a', '#a03820', '#8fa86e', '#d4a85a'];
  var nextId = 1000;

  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var text = parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : '');
    return text.toUpperCase();
  }

  function colorFor(name) {
    var sum = 0;
    for (var i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }

  function makeComment(author, text, replies) {
    nextId += 1;
    return {
      id: 'c' + nextId,
      author: author,
      text: text,
      time: 'just now',
      replies: replies || []
    };
  }

  var data = [
    {
      id: 'c1',
      author: 'Marlene Osei',
      time: '2h ago',
      text: "This is exactly the kind of pacing I've been trying to explain to my team. Slow, deliberate, nothing rushed.",
      replies: [
        {
          id: 'c1-1',
          author: 'Tobias Wren',
          time: '1h ago',
          text: 'Agreed. Curious how you handle the weeks where nothing seems to move though?',
          replies: [
            {
              id: 'c1-1-1',
              author: 'Marlene Osei',
              time: '48m ago',
              text: "Mostly I just log what I did and trust the compounding. It rarely feels like progress in the moment.",
              replies: [
                {
                  id: 'c1-1-1-1',
                  author: 'Priya Chandrasekaran',
                  time: '30m ago',
                  text: 'This thread alone is worth bookmarking.',
                  replies: []
                }
              ]
            }
          ]
        },
        {
          id: 'c1-2',
          author: 'Delphine Ruiz',
          time: '55m ago',
          text: 'Same experience here — the small unglamorous habits are the ones that stick.',
          replies: []
        }
      ]
    },
    {
      id: 'c2',
      author: 'Kojo Ampratwum',
      time: '3h ago',
      text: 'Does anyone have a good template for tracking this over a full quarter instead of just weekly?',
      replies: [
        {
          id: 'c2-1',
          author: 'Han Seo-yeon',
          time: '2h ago',
          text: "I built a simple spreadsheet for this, happy to share if useful.",
          replies: []
        }
      ]
    },
    {
      id: 'c3',
      author: 'Freya Lindqvist',
      time: '5h ago',
      text: 'Bookmarking this for later, thank you for writing it up so clearly.',
      replies: []
    }
  ];

  function findComment(id, nodes) {
    nodes = nodes || data;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return nodes[i];
      var found = findComment(id, nodes[i].replies);
      if (found) return found;
    }
    return null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildCommentNode(comment, depth) {
    var wrap = el('div', 'thread-comment');
    wrap.setAttribute('role', 'listitem');
    wrap.dataset.id = comment.id;

    var av = el('div', depth > 0 ? 'thread-avatar thread-avatar--sm' : 'thread-avatar', initials(comment.author));
    av.style.setProperty('--av-bg', colorFor(comment.author));
    wrap.appendChild(av);

    var body = el('div', 'thread-comment-body');

    var head = el('div', 'thread-comment-head');
    head.appendChild(el('span', 'thread-author', comment.author));
    head.appendChild(el('span', 'thread-time', comment.time));
    body.appendChild(head);

    body.appendChild(el('p', 'thread-text', comment.text));

    var actions = el('div', 'thread-actions');
    var replyBtn = el('button', 'thread-action', 'Reply');
    replyBtn.type = 'button';
    actions.appendChild(replyBtn);
    body.appendChild(actions);

    var replyBox = el('div', 'thread-reply-box');
    var replyAv = el('div', 'thread-avatar thread-avatar--sm', 'YO');
    replyAv.style.setProperty('--av-bg', '#5a7a3a');
    replyBox.appendChild(replyAv);

    var replyBodyWrap = el('div', 'thread-compose-body');
    var replyTextarea = el('textarea', 'thread-textarea');
    replyTextarea.rows = 2;
    replyTextarea.placeholder = 'Reply to ' + comment.author + '...';
    replyBodyWrap.appendChild(replyTextarea);

    var replyActions = el('div', 'thread-reply-actions');
    var cancelBtn = el('button', 'thread-btn', 'Cancel');
    cancelBtn.type = 'button';
    var submitBtn = el('button', 'thread-btn thread-btn--solid', 'Reply');
    submitBtn.type = 'button';
    replyActions.appendChild(cancelBtn);
    replyActions.appendChild(submitBtn);
    replyBodyWrap.appendChild(replyActions);

    replyBox.appendChild(replyBodyWrap);
    body.appendChild(replyBox);

    replyBtn.addEventListener('click', function () {
      var wasOpen = replyBox.classList.contains('is-open');
      replyBox.classList.toggle('is-open', !wasOpen);
      if (!wasOpen) replyTextarea.focus();
    });

    cancelBtn.addEventListener('click', function () {
      replyBox.classList.remove('is-open');
      replyTextarea.value = '';
    });

    submitBtn.addEventListener('click', function () {
      var val = replyTextarea.value.trim();
      if (!val) {
        replyTextarea.focus();
        return;
      }
      var target = findComment(comment.id);
      if (!target) return;
      var newReply = makeComment('You', val);
      target.replies.push(newReply);
      replyTextarea.value = '';
      replyBox.classList.remove('is-open');
      rerender();
    });

    if (comment.replies && comment.replies.length) {
      var repliesWrap = el('div', 'thread-replies');
      comment.replies.forEach(function (child) {
        repliesWrap.appendChild(buildCommentNode(child, depth + 1));
      });
      body.appendChild(repliesWrap);
    }

    wrap.appendChild(body);
    return wrap;
  }

  function rerender() {
    list.innerHTML = '';
    data.forEach(function (comment) {
      list.appendChild(buildCommentNode(comment, 0));
    });
  }

  composeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = composeInput.value.trim();
    if (!val) {
      composeInput.focus();
      return;
    }
    var newComment = makeComment('You', val);
    data.unshift(newComment);
    composeInput.value = '';
    rerender();

    var node = list.firstElementChild;
    if (node) {
      node.classList.add('thread-new');
      if (!reduceMotion) {
        window.setTimeout(function () {
          node.classList.remove('thread-new');
        }, 400);
      }
    }
  });

  rerender();
})();
