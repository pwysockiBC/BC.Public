// The four agreements shown on the PHC form, word for word as staff supplied them (including
// their typos; corrections need program staff sign-off). Any wording change is a new version:
// bump AGREEMENTS_VERSION here and Phc:AgreementsVersion in the API's settings together.

export const AGREEMENTS_VERSION = "2027-1"

export type AgreementBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }     // a bulleted list
  | { kind: "lines"; items: string[] }    // lines kept as they are, e.g. an address

export type AgreementKey = "volunteer" | "terms" | "privacy" | "training"

export type Agreement = {
  key: AgreementKey
  title: string
  // The checkbox label.
  confirm: string
  blocks: AgreementBlock[]
}

export const agreements: Agreement[] = [
  {
    "key": "volunteer",
    "title": "Volunteer / Affiliate Agreement",
    "confirm": "I Agree That I Have Read The Volunteer / Affiliate Agreement",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "(PLEASE NOTE - One Agreement per Affiliation is enough for all volunteers participating at the event) I, hereinafter referred to as “the Volunteer /Affiliate”), including its agents, agree to the following:"
      },
      {
        "kind": "heading",
        "text": "Scope Of Services And Compensation"
      },
      {
        "kind": "paragraph",
        "text": "The Volunteer/Affiliate agrees to participate at the Bergen County Department of Human Services’ (“BCDHS”) Bergen County Project Homeless Connect/Point in Time (“PHC/PIT”), on Wednesday, January 27, 2027 from 9:30 AM to 2:00 PM at the Bergen County Housing, Health and Human Services Center, 120 South River Street, Hackensack, NJ 07601. The Volunteer /Affiliate will provide, at no cost to the County of Bergen (“County”), the service(s) selected abovee."
      },
      {
        "kind": "heading",
        "text": "Indemnification"
      },
      {
        "kind": "paragraph",
        "text": "The Volunteer /Affiliate understands and agrees to assume full responsibility for any and all damages, injuries, and losses that may be sustained in the course of the volunteer work, whether it is the result of its actions, the actions of the BCDHS), or any other official, employee, agent or volunteer of same or the County. The Volunteer/Affiliate also waives all claims against any and all persons and groups associated with the BCDHS or the County. The Volunteer/Affiliate understands that he/she is giving up his/her right to sue any official, employee, agent, or volunteer of the BCDHS or the County for injuries sustained in the course of volunteer work for the BCDHS. The Volunteer/Affiliate understands that the County has an accident policy for volunteers with limits of a $10,000.00 principal sum and $5,000.00 for maximum accident medical expenses subject to the terms and conditions of the policy which may be viewed upon request. The Volunteer/Affiliate will also hold the County, BCDHS, and any official, employee, agent, or volunteer thereof harmless beyond the limits stated above, which will limit a maximum recovery of $10,000.00 and $5,000.00 in medical expense payments, subject to the terms and conditions of the policy. The Volunteer/Affiliate further agrees, to the fullest extent permitted by law, to defend, indemnify, and hold harmless the County, its officials, employees, agents, volunteers or other representatives from and against any and all claims that may be filed in equity or law as to any liability, loss, damage, or expense including, but not limited to, attorney’s fees, court costs and/or judgments that may arise with regard to the agreement, along with such that may result, in whole or in part, from any malicious acts, negligence, or omissions on my part, and excluding any malicious acts or negligence by the County, its employees, officials, agents, or other representatives. The obligations hereunder shall survive the expiration or other terms of this agreement. The Volunteer/Affiliate is aware that he/she has the right to have this waiver form reviewed by an attorney if necessary."
      },
      {
        "kind": "heading",
        "text": "Solicitation"
      },
      {
        "kind": "paragraph",
        "text": "The Volunteer/Affiliate acknowledges that solicitation of clients is strictly prohibited. The Volunteer/Affiliate must hereby respect the right to privacy of any and all clients of the BCDHS and understands that it is prohibited from soliciting private information from such clients. The Volunteer/Affiliate must present information in a simple and clear manner that a consumer will understand, and provide information about their service(s)/product(s) only. Steering clients to a service(s)/product(s) offered by the Volunteer/Affiliate is prohibited, and any such misrepresentation of a service/product is prohibited. The Volunteer/Affiliate further understands that any violation of this clause may result in the vendor being asked to stop the presentation."
      },
      {
        "kind": "heading",
        "text": "Confidentiality"
      },
      {
        "kind": "paragraph",
        "text": "In addition to any/all HIPAA requirements, all Volunteers/Affiliates shall maintain the confidentiality of each participant’s personal and confidential information and shall not disclose such information, except where disclosure is consistent with applicable rules and policies, and/or the disclosure is to the participant or to the participant’s legal representative, to a party upon the informed written consent of the participant or the participant’s legal representative, to a party pursuant to a court order, or if disclosure is for program monitoring by authorized Federal, State, or local monitoring agencies."
      }
    ]
  },
  {
    "key": "terms",
    "title": "Terms of Use Policy",
    "confirm": "I Agree That I Have Read The Terms of Use Policy",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "By visiting this site, you are accepting these terms of use, including the following policies and practices. This notice and these policies may be modified from time to time without notice, so please check back periodically."
      },
      {
        "kind": "heading",
        "text": "Information Disclaimer"
      },
      {
        "kind": "paragraph",
        "text": "By visiting this site, you understand and agree that the County of Bergen Web site is provided \"as is\". The County of Bergen makes every effort to provide accurate and complete information on this website. The information contained herein is not official nor in any way shall it be deemed to constitute legal notice where such legal notice is required by law. The information contained in this site is provided as a service and convenience to people needing information about the County of Bergen. Portions of the information on this site may be incorrect or not current. The County of Bergen, its officers, employees or agents shall not be liable for damages or losses of any kind arising out of or in connection with the use or performance of information, including but not limited to, damages or losses caused by reliance upon the accuracy or timeliness of any such information, or damages incurred from the viewing, distributing, or copying of those materials."
      },
      {
        "kind": "heading",
        "text": "Linking Policy"
      },
      {
        "kind": "heading",
        "text": "Links to External Sites:"
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen Web site contains links to outside websites. These websites are not owned, operated, controlled or reviewed by the County of Bergen. These links are provided solely as a courtesy and convenience to you, the visitor."
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen, its officers or employees, exercise no control over the organizations, views, accuracy, copyright or trademark, compliance or the legality of the material contained in these outside websites. The County of Bergen, its officers or employees, do not sponsor, endorse, or approve the information, content, proceeds, materials, opinions or services contained on such outside websites. The visitor proceeds to these outside websites at his/her own risk. The County of Bergen specifically disclaims any and all liability from damages, which may result from the accessing of a third-party site, which is linked to the County of Bergen Web site or from reliance upon only such information."
      },
      {
        "kind": "heading",
        "text": "Links from External Sites:"
      },
      {
        "kind": "paragraph",
        "text": "If you link to the County of Bergen Web site, you must abide by the following practices:"
      },
      {
        "kind": "list",
        "items": [
          "Link to, but do not replicate, our content;",
          "Do not create a browser or border environment around our content. Always open our site in a new window. Do not open our site in your frames;",
          "Do not imply our endorsement of your site or your products;",
          "Do not misrepresent your relationship with us;",
          "Do not use our logo on your site without express written permission;",
          "Your site must not contain content that could be considered illegal, distasteful or controversial, and should only contain content that correlates to the County of Bergen Web site subject matter."
        ]
      },
      {
        "kind": "paragraph",
        "text": "If you decide to link to us, we need to know about it. Please contact the individual shown in the \"Contact Information\" section of the privacy policy below."
      },
      {
        "kind": "heading",
        "text": "Endorsement Disclaimer"
      },
      {
        "kind": "paragraph",
        "text": "Reference in this website to any specific commercial products, processes, or services, or the use of any trade firm or corporation name is for the information and convenience of the public, and does not constitute endorsement, recommendation, or favoring by County of Bergen or its officers, employees or agents."
      },
      {
        "kind": "heading",
        "text": "Copyright and Trademark Limitations:"
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen makes no warranty that materials contained herein are free of copyright or trademark claims or other restrictions or limitations on free use or display. Making a copy of such material may be subject to copyright or trademark laws"
      }
    ]
  },
  {
    "key": "privacy",
    "title": "Privacy Statement",
    "confirm": "I Agree That I Have Read The Privacy Statement",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "This statement is designed to assist you in understanding how we collect, use and safeguard information you provide to us and to assist you in making informed decisions when using the County of Bergen's web site. It will be continuously assessed against new technologies, business practices and the needs of our visitors."
      },
      {
        "kind": "heading",
        "text": "Information Disclaimer"
      },
      {
        "kind": "paragraph",
        "text": "By visiting this site, you understand and agree that the County of Bergen Web site is provided \"as is\". The County of Bergen makes every effort to provide accurate and complete information on this website. The information contained herein is not official nor in any way shall it be deemed to constitute legal notice where such legal notice is required by law. The information contained in this site is provided as a service and convenience to people needing information about the County of Bergen. Portions of the information on this site may be incorrect or not current. The County of Bergen, its officers, employees, or agents shall not be liable for damages or losses of any kind arising out of or in connection with the use or performance of information, including but not limited to, damages or losses caused by reliance upon the accuracy or timeliness of any such information, or damages incurred from the viewing, distributing, or copying of those materials."
      },
      {
        "kind": "list",
        "items": [
          "1. The Internet domain and IP address from which you access our Web site;",
          "2. The type of browser and operating system used to access our site;",
          "3. The date and time you access our site;",
          "4. The pages you visit; and",
          "5. If you linked to the County of Bergen Web site from another Web site, the address of that Web site."
        ]
      },
      {
        "kind": "paragraph",
        "text": "We use this information to help us make our site more useful to visitors - to learn about the number of visitors to our site and the types of technology our visitors use. We do not track or record information about individuals and their visits. IP addresses are not linked to identifiable information."
      },
      {
        "kind": "heading",
        "text": "If You Send Us Personal Information"
      },
      {
        "kind": "paragraph",
        "text": "If you choose to provide us with personal information - by sending an e-mail or by filling out a form with your personal information and submitting, it to us through our Web site - we use that information to respond to your message and to help us get you the information you have requested. We share the information you give us with another government agency only if your inquiry relates to that agency, or as otherwise required by law. Moreover, we do not create individual profiles with the information you provide or give it to any private organizations. The County of Bergen website does not collect information for commercial marketing or sell any information provided by users through this Web site to third parties."
      },
      {
        "kind": "paragraph",
        "text": "If you choose to pay for fees or permits, if applicable, online through the TD Bank payment portal, any personal information you submit will be used solely to update our files to reflect that you have purchased a permit or submitted fees for a class, training and or any other permitted transaction available on the County of Bergen website. Credit card information is stored securely offline and will be used solely for administrative purposes (e.g., in the event that you wish to revise a particular credit card transaction)."
      },
      {
        "kind": "paragraph",
        "text": "The use of, and access to your personal information is restricted to those employees who need to know that information to provide services or support to you. We maintain physical, electronic, and procedural safeguards to protect your personal information."
      },
      {
        "kind": "heading",
        "text": "Personal Information and E-mail Privacy Warning"
      },
      {
        "kind": "paragraph",
        "text": "You may choose whether to provide personal information online. \"Personal information\" is information about a natural person that identifies a specific individual. Personal information includes such things as an individual's name, address, and phone number. A domain name or Internet protocol address is not considered personal information."
      },
      {
        "kind": "paragraph",
        "text": "We collect no personal information about you unless you voluntarily provide it to us by sending us e-mail, participating in a survey, paying for a permit/class/fee online, or completing an online form. You may choose not to contact us by e-mail, participate in a survey, pay your permit/class/fee online, or provide any personal information using an online form. Your choice not to participate in these activities will not impair your ability to browse the County of Bergen's Web site and read or download any information posted on the site."
      },
      {
        "kind": "heading",
        "text": "E-mail Privacy Warning"
      },
      {
        "kind": "paragraph",
        "text": "E-mail is not a secure medium. Personal information sent via the Internet can be intercepted. You may, therefore, wish to reconsider the advisability of sending messages that contain highly sensitive, personal information to this Internet address. The County of Bergen has no intention of releasing 'personal information' sent to us voluntarily, but may be required to do so pursuant to a request under the Right to Know law, the common law Right to Know, the Open Public Records Act, or other State or Federal law or pursuant to court order. If you believe that your personal information is being used for a purpose other than what was intended when you submitted it, please contact the individual shown in the \"Contact Information\" section of this privacy policy."
      },
      {
        "kind": "heading",
        "text": "Public Access to Information"
      },
      {
        "kind": "paragraph",
        "text": "All the information posted on the County of Bergen's Web site is public information that is subject to inspection and copying by members of the public, unless an exemption in law exists."
      },
      {
        "kind": "heading",
        "text": "Cookies"
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen Web site does not use cookies. Cookies are simple text files stored on your computer by Internet Web sites to help identify users and customize user experience. Should the County of Bergen choose in the future to use cookies, they will not contain personally identifying information and will expire at the end of the web-surfing session or after a fixed period of time."
      },
      {
        "kind": "heading",
        "text": "Security"
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen, as developer and manager of this Web site has taken several steps to safeguard the integrity of its data and prevent unauthorized access to information maintained. These measures are designed and intended to prevent corruption of data, block unknown or unauthorized access to our systems and information, and to provide reasonable protection of private and personal information in our possession. This Web site takes every precaution to protect users' information. When users submit sensitive information via the Web site, their information is protected both online and offline. When we ask users to enter personal information (such as credit card number), that information is encrypted and is protected with encryption software -SSL (secure sockets layer). While we use SSL encryption to protect sensitive information online, we also protect user information offline."
      },
      {
        "kind": "heading",
        "text": "Disclaimer"
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen's Web site and materials may contain hypertext or links to other Internet computer sites, which are not owned, operated, controlled or reviewed by the County of Bergen. These links are provided solely as a courtesy and convenience to you, the visitor. When you link to one of these sites, you are no longer on the County of Bergen Web site and this privacy policy will not apply. When you link to another Web site, you are subject to the privacy policy of that new site."
      },
      {
        "kind": "paragraph",
        "text": "The County of Bergen exercises no control over the organizations, views, accuracy, copyright or trademark compliance or the legality of the material contained on those servers and does not sponsor, endorse, or approve the information, content, products, materials, opinions or services contained on such external sites. The visitor proceeds to these external sites at their own risk. The County of Bergen specifically disclaims any and all liability from damages that may result from the accessing of a third party site which is linked to the County of Bergen Web site, or from reliance upon any such information."
      },
      {
        "kind": "heading",
        "text": "Unauthorized Modifications"
      },
      {
        "kind": "paragraph",
        "text": "Unauthorized attempts to modify or otherwise alter any information or image stored on any County of Bergen website may result in criminal prosecution."
      },
      {
        "kind": "heading",
        "text": "Contact Information"
      },
      {
        "kind": "lines",
        "items": [
          "To offer comments about the County of Bergen Web site, or about this privacy statement:",
          "County of Bergen",
          "Bergen County Department of Health Services",
          "One Bergen County Plaza • Hackensack, NJ 07601-7076",
          "hsplanning@bergencountynj.gov"
        ]
      }
    ]
  },
  {
    "key": "training",
    "title": "Attend Required Training Statement",
    "confirm": "I Have Read and Agree That I Will Attend the Required Training",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "This statement outlines your mandatory training requirements."
      },
      {
        "kind": "heading",
        "text": "Attend Training Confirmation"
      },
      {
        "kind": "paragraph",
        "text": "Please confirm that you will attend the PIT Count Office Hours MANDATORY TRAINING via zoom provided by Monarch Housing.This training is learning to administer and enhance the reliability of the PIT survey.*Upon registration, the PIT Coordinator will contact you and provide CARE PACKAGE BAGS with SURVEY'S and additional information."
      }
    ]
  }
]
