const BACKEND_ENDPOINT = 'https://localhost:44380/api'
var id_edit_contact = -1;

function onloadPage()
{
    $.ajax({
        url: `${BACKEND_ENDPOINT}/contacts`,
        processData: false,
        contentType: false,
        type: 'GET',
        success: function(data){
        clearTable()
        fillTable(data)
        clearForm()
        },
        error: function(err)
        {
            fillTable([])
            alert("Ups!!! Something has gone wrong. Please check endpoint")
            console.log(err)
        }
    });
}

function fillTable(data) 
{
    if(data.length > 0)
        for(let i =0; i < data.length; i++)
        {
            $("#list_contacts > tbody")
                .append(
                    `<tr>
                        <th scope="row"><input type="button" onclick="fillForm(${data[i].id})" class="btn btn-link" value="${i + 1}"/></th>
                        <td>${data[i].firstName} ${data[i].secondName}</td>
                        <td>${data[i].dateOfBirth.split('T')[0]}</td>
                        <td>${data[i].addresses}</td>
                        <td>${data[i].phoneNumbers}</td>
                        <td><button class="btn btn-danger btn" type="button" onclick="remove(${data[i].id})">Delete</button></td>
                    </tr>`
                    );
        }
    else 
    {
        $("#list_contacts > tbody").append(`<tr><td style="text-align: center" colspan="6">Not data yet</td></tr>`);
    }
}

function clearTable()
{
    $("#list_contacts > tbody").empty()
}

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        $('#showImage').attr('src', e.target.result).width(150).height(200);
      };
      reader.readAsDataURL(input.files[0]);
    }
}

function fetchDataForm()
{
    var form = $('form')[0]; 
    var formData = new FormData(form);

    return formData

}

function save()
{
    console.log($('#id_contact').val())
    let id_contact = $('#id_contact').val();
    if(id_contact == '' )
    {
        create()
    }
    else
    {
        update(id_contact);
    }
}

function create()
{
  $.ajax({
    url: `${BACKEND_ENDPOINT}/contacts`,
    data: fetchDataForm(),
    processData: false,
    contentType: false,
    type: 'POST',
    success: function(data){
      alert("The contact has been created.");
      clearTable()
      onloadPage()
      clearForm()
    },
    error: function(err)
        {
            alert("Ups!!! Something has gone wrong")
            console.log(err)
        }
  });
}

function update(index)
{
    let data = fetchDataForm()
    data.append("id", index)
    $.ajax({
        url: `${BACKEND_ENDPOINT}/contacts/${index}`,
        data: data,
        processData: false,
        contentType: false,
        type: 'PUT',
        success: function(data){
          alert("The contact has been updated.");
          clearTable()
          onloadPage()
          clearForm()
        },
        error: function(err)
        {
            alert("Ups!!! Something has gone wrong")
            console.log(err)
        }
      });
}

function remove(index)
{
    $.ajax({
        url: `${BACKEND_ENDPOINT}/contacts/${index}`,
        processData: false,
        contentType: false,
        type: 'DELETE',
        success: function(data){
          alert("The contact has been deleted.");
          clearTable()
          onloadPage()
          clearForm()
        },
        error: function(err)
        {
            alert("Ups!!! Something has gone wrong")
            console.log(err)
        }
      });
}

function fillForm(index)
{
    $.ajax({
        url: `${BACKEND_ENDPOINT}/contacts/${index}`,
        processData: false,
        contentType: false,
        type: 'GET',
        success: function(data){
            $('#FirstName').val(data.firstName);
            $('#SecondName').val(data.secondName);
            $('#DateOfBirth').val(data.dateOfBirth.split('T')[0]);
            $('#PhoneNumbers').val(data.phoneNumbers);
            $('#Addresses').val(data.addresses);
            $('#showImage').attr('src', data.personalPhoto);
            $('#id_contact').val(data.id);
        },
        error: function(err)
        {
            alert("Ups!!! Something has gone wrong")
            console.log(err)
        }
      });
}

function filterByName()
{
    let name = $('#FilterByName').val()
    if(name !== '' && name !== ' ' && name !== null && name !== undefined)
        $.ajax({
            url: `${BACKEND_ENDPOINT}/contacts/findByName/${name}`,
            processData: false,
            contentType: false,
            type: 'GET',
            success: function(data){
            clearTable()
            fillTable(data)
            },
            error: function(err)
            {
                alert("Ups!!! Something has gone wrong")
                console.log(err)
            }
        });
    else 
    {
        clearTable()
        onloadPage()
        clearForm()
    }
}

function filterByAgeRange()
{
    let from = $('#FromFilterByAge').val() !== '' ? $('#FromFilterByAge').val() : 0
    let to = $('#ToFilterByAge').val() !== '' ? $('#ToFilterByAge').val() : 999
    if(from === 0 && to === 999)
    {
        clearTable()
        onloadPage()
    }
    else 
        $.ajax({
            url: `${BACKEND_ENDPOINT}/contacts/findByAge/${from}/${to}/`,
            processData: false,
            contentType: false,
            type: 'GET',
            success: function(data){
            clearTable()
            fillTable(data)
            clearForm()
            },
            error: function(err)
            {
                alert("Ups!!! Something has gone wrong")
                console.log(err)
            }
        });
}

function clearForm()
{
    $('#form').trigger("reset");
    $('#showImage').attr('src', './img/avatar.png');
    $('#id_contact').val('');
}